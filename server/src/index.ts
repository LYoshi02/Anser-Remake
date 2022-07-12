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
import cookieParser from "cookie-parser";
import cors from "cors";

import "reflect-metadata";

import { UserResolver } from "./resolvers/user/userResolver";
import { ChatResolver } from "./resolvers/chat/chatResolver";
import { GroupChatResolver } from "./resolvers/chat/groupChatResolver";
import { ObjectIdScalar } from "./utils/objectId.scalar";
import { TypegooseMiddleware } from "./middlewares/typegoose";
import {
  getUserIdWithToken,
  getAccessToken,
  extractBearerToken,
  getRefreshToken,
  createAccessToken,
  createRefreshToken,
  sendRefreshToken,
} from "./utils/auth";
import { UserModel } from "./schemas/user";
import { JwtPayload } from "./types";

const port = process.env.PORT || 4000;

async function startApp() {
  try {
    const app = express();
    app.use(
      cors({
        credentials: true,
        origin: ["http://localhost:3000", "https://studio.apollographql.com"],
      })
    );
    app.use(cookieParser());
    app.use(graphqlUploadExpress({ maxFileSize: 10000000 }));

    app.post("/refresh-token", async (req, res) => {
      console.log("Refreshing token");
      const token = req.cookies.jid;
      if (!token) {
        return res.send({ ok: false, accessToken: "" });
      }

      const payload = getRefreshToken(token);
      if (!payload) {
        return res.send({ ok: false, accessToken: "" });
      }

      const user = await UserModel.findById(payload.userId);
      if (!user) {
        return res.send({ ok: false, accessToken: "" });
      }

      const tokenData: JwtPayload = {
        userId: user._id,
        username: user.username,
      };

      const refreshToken = createRefreshToken(tokenData);
      sendRefreshToken(res, refreshToken);

      return res.send({
        ok: true,
        accessToken: createAccessToken(tokenData),
      });
    });

    const httpServer = createServer(app);

    const schema = await buildSchema({
      resolvers: [UserResolver, ChatResolver, GroupChatResolver],
      emitSchemaFile: true,
      scalarsMap: [{ type: ObjectId, scalar: ObjectIdScalar }],
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

          const accessToken = getAccessToken(token);
          if (!accessToken) {
            return false;
          }

          console.log("connected");
        },
        context: (ctx, msg, args) => {
          const userId = getUserIdWithToken(ctx.connectionParams?.authToken);

          return { userId };
        },
      },
      wsServer
    );

    const serverCleanup = useServer({ schema }, wsServer);

    const apolloServer = new ApolloServer({
      schema,
      context: ({ req, res }) => ({ req, res }),
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
    apolloServer.applyMiddleware({
      app,
      cors: false,
    });

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
