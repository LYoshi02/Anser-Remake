import express, { Express } from "express";
import { ApolloServer } from "apollo-server-express";
import mongoose from "mongoose";
import { buildSchema } from "type-graphql";
import "reflect-metadata";

import { UserResolver } from "./resolvers/userResolver";

async function main() {
  try {
    const app: Express = express();

    const schema = await buildSchema({
      resolvers: [UserResolver],
      emitSchemaFile: true,
    });

    const server = new ApolloServer({
      schema,
    });

    await server.start();

    server.applyMiddleware({ app });

    const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.qyzyf.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
    await mongoose.connect(uri);

    app.listen(4000, () =>
      console.log("Server is running on http://localhost:4000/graphql")
    );
  } catch (error: any) {
    console.log(error);
  }
}

main();
