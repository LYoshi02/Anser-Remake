import express from "express";
import mongoose from "mongoose";
import { ObjectId } from "mongodb";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { graphqlUploadExpress } from "graphql-upload";
import { v2 as cloudinary } from "cloudinary";

import { createServer } from "http";
import { ApolloServerPluginDrainHttpServer } from "apollo-server-core";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/lib/use/ws";

import "reflect-metadata";

import { AuthMiddleware } from "./middlewares/auth";
import { UserResolver } from "./resolvers/user/userResolver";
import { ChatResolver } from "./resolvers/chat/chatResolver";
import { GroupChatResolver } from "./resolvers/chat/groupChatResolver";
import { CustomRequest } from "./types";
import { ObjectIdScalar } from "./utils/objectId.scalar";
import { TypegooseMiddleware } from "./middlewares/typegoose";
import {
  getUserIdWithToken,
  getDecodedToken,
  extractBearerToken,
} from "./utils/auth";

const port = process.env.PORT || 4000;

async function startApp() {
  try {
    const app = express();
    app.use(AuthMiddleware);
    app.use(graphqlUploadExpress({ maxFileSize: 10000000 }));

    const httpServer = createServer(app);

    const schema = await buildSchema({
      resolvers: [UserResolver, ChatResolver, GroupChatResolver],
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
            return false;
          }

          const token = extractBearerToken(
            ctx.connectionParams.authToken as string
          );
          if (!token) {
            return false;
          }

          const decodedToken = getDecodedToken(token);
          if (!decodedToken) {
            return false;
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

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    });

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
