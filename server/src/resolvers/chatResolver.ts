import { AuthenticationError, ValidationError } from "apollo-server-express";
import { Query, Resolver, Ctx, Mutation, Arg } from "type-graphql";
import { ObjectId } from "mongodb";

import { Context } from "../types";
import { AddMessageInput } from "./types/chat";
import { Chat, ChatModel } from "../schemas/chat";
import { Message } from "../schemas/message";
import { UserModel } from "../schemas/user";

@Resolver((of) => Chat)
export class ChatResolver {
  @Query((returns) => [Chat])
  async getChats(@Ctx() ctx: Context): Promise<Chat[]> {
    if (!ctx.isAuth || !ctx.user) {
      throw new AuthenticationError("User is not authenticated");
    }

    const chats = await ChatModel.find({ users: { $in: [ctx.user._id] } })
      .populate("users")
      .sort({ updatedAt: "desc" })
      .slice("messages", -1)
      .exec();

    return chats;
  }

  @Query((returns) => Chat)
  async getChat(
    @Arg("recipientUsername") recipientUsername: string,
    @Ctx() ctx: Context
  ): Promise<Chat> {
    if (!ctx.isAuth || !ctx.user) {
      throw new AuthenticationError("User is not authenticated");
    }

    const recipient = await UserModel.findOne(
      { username: recipientUsername },
      { _id: 1 }
    );

    if (!recipient) {
      throw new ValidationError("Chat not found");
    }

    const chat = await ChatModel.findOne({
      users: { $all: [ctx.user._id, recipient._id], $size: 2 },
    })
      .populate("users")
      .exec();

    if (!chat) {
      throw new ValidationError("Chat not found");
    }

    return chat;
  }

  @Mutation((returns) => Chat)
  async addMessage(
    @Arg("chatData") { recipients, text, chatId }: AddMessageInput,
    @Ctx() ctx: Context
  ): Promise<Chat> {
    if (!ctx.isAuth || !ctx.user) {
      throw new AuthenticationError("User is not authenticated");
    }

    let chat = await ChatModel.findOne({
      _id: chatId,
      users: {
        $in: [ctx.user._id],
      },
    });

    if (!chat) {
      chat = new ChatModel({
        users: recipients,
      });
    }

    const newMessage: Message = {
      _id: new ObjectId(),
      text,
      sender: ctx.user._id,
    };

    chat.messages.push(newMessage);
    await chat.save();

    return chat;
  }
}
