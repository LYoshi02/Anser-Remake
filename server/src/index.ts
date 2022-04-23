import express from "express";
import mongoose from "mongoose";
import { ObjectId } from "mongodb";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";

import { createServer } from "http";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";

import "reflect-metadata";

import { AuthMiddleware } from "./middlewares/auth";
import { UserResolver } from "./resolvers/userResolver";
import { ChatResolver } from "./resolvers/chatResolver";
import { CustomRequest } from "./types";
import { ObjectIdScalar } from "./utils/objectId.scalar";
import { TypegooseMiddleware } from "./middlewares/typegoose";
import {
  getUserIdWithToken,
  getDecodedToken,
  extractBearerToken,
} from "./utils/user";

const port = process.env.PORT || 4000;

async function startApp() {
  try {
    const app = express();
    app.use(AuthMiddleware);

    const httpServer = createServer(app);

    const schema = await buildSchema({
      resolvers: [UserResolver, ChatResolver],
      emitSchemaFile: true,
      scalarsMap: [{ type: ObjectId, scalar: ObjectIdScalar }],
      validate: false,
      globalMiddlewares: [TypegooseMiddleware],
    });

    // Creating the WebSocket server
    const wsServer = new WebSocketServer({
      server: httpServer,
      path: "/graphql",
    });

    useServer(
      {
        schema,
        onConnect: (ctx) => {
          if (!ctx.connectionParams || !ctx.connectionParams.authToken) {
            throw new Error("Auth token missing");
          }

          const token = extractBearerToken(
            ctx.connectionParams.authToken as string
          );
          if (!token) {
            throw new Error("Auth token missing");
          }

          const decodedToken = getDecodedToken(token);
          if (!decodedToken) {
            throw new Error("Invalid auth token");
          }
        },
        context: async (ctx, msg, args) => {
          const userId = await getUserIdWithToken(
            ctx.connectionParams?.authToken
          );

          return { userId };
        },
      },
      wsServer
    );

    const serverCleanup = useServer({ schema }, wsServer);

    const apolloServer = new ApolloServer({
      schema,
      context: ({ req }) => {
        const myReq = req as CustomRequest;

        return {
          user: myReq.user,
          isAuth: myReq.isAuth,
        };
      },
      plugins: [
        // Proper shutdown for the HTTP server.
        ApolloServerPluginDrainHttpServer({ httpServer }),

        // Proper shutdown for the WebSocket server.
        {
          async serverWillStart() {
            return {
              async drainServer() {
                await serverCleanup.dispose();
              },
            };
          },
        },
      ],
    });

    await apolloServer.start();
    apolloServer.applyMiddleware({ app, cors: true });

    const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.qyzyf.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
    await mongoose.connect(uri);

    httpServer.listen(port, () => {
      console.log(
        `> Server listening at http://localhost:${port}${apolloServer.graphqlPath}`
      );
    });
  } catch (error) {
    console.log(error);
  }
}

startApp();
