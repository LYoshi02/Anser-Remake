import { AuthenticationError, ValidationError } from "apollo-server-express";
import {
  Query,
  Resolver,
  Ctx,
  Mutation,
  Arg,
  Publisher,
  PubSub,
  Root,
  Subscription,
} from "type-graphql";
import { ObjectId } from "mongodb";

import { Context } from "../../types";
import {
  AddMessageInput,
  NewChatInput,
  NewMessage,
  NewMessagePayload,
} from "./types";
import { Chat, ChatModel } from "../../schemas/chat";
import { Message } from "../../schemas/message";
import { UserModel } from "../../schemas/user";
import { generateChatUsersArr } from "./utils";

@Resolver((of) => Chat)
export class ChatResolver {
  // TODO: the last message needs to include the user doing the request withing the "users" property
  @Query((returns) => [Chat])
  async getChats(@Ctx() ctx: Context): Promise<Chat[]> {
    if (!ctx.isAuth || !ctx.user) {
      throw new AuthenticationError("User is not authenticated");
    }

    /*
      GOALS: 
      1. Filter user’s chats including those whose “users” property contains the id 
      of the authenticated user or those that contain a message sent by him.
      2. The property "messages" of each chat must contain the last message the 
      authenticated user received in that chat (important for the group chats).
      3. The chats must be sorted from the most recent to the oldest
    */
    const chats = await ChatModel.aggregate([
      {
        $match: {
          $or: [
            { users: { $in: [ctx.user._id] } },
            { "messages.users": { $in: [ctx.user._id] } },
          ],
        },
      },
      {
        $addFields: {
          messages: {
            $filter: {
              input: "$messages",
              as: "message",
              cond: { $in: [ctx.user._id, "$$message.users"] },
            },
          },
        },
      },
      {
        $sort: {
          updatedAt: -1,
        },
      },
    ]);

    const populatedChats = await ChatModel.populate(chats, {
      path: "users",
    });

    return populatedChats;
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
      group: null,
    })
      .populate("messages.sender")
      .exec();

    if (!chat) {
      throw new ValidationError("Chat not found");
    }

    return chat;
  }

  @Mutation((returns) => Chat)
  async createNewChat(
    @PubSub("NEW_MESSAGE") publishNewMessage: Publisher<NewMessagePayload>,
    @Arg("chatData") { recipients, text }: NewChatInput,
    @Ctx() ctx: Context
  ): Promise<Chat> {
    if (!ctx.isAuth || !ctx.user) {
      throw new AuthenticationError("User is not authenticated");
    }

    const authUserId = ctx.user._id;
    const chatUsers = generateChatUsersArr(recipients, authUserId);

    const existingChat = await ChatModel.findOne({
      users: {
        $all: chatUsers,
        $size: chatUsers.length,
      },
      group: null,
    });

    if (existingChat) {
      throw new AuthenticationError("Chat already exists");
    }

    const newMessage: Message = {
      _id: new ObjectId(),
      text,
      sender: authUserId,
      users: chatUsers,
    };

    const newChat = new ChatModel({
      users: chatUsers,
      messages: [newMessage],
    });
    await newChat.populate("users");
    await newChat.save();

    await publishNewMessage({
      chatId: newChat._id,
      users: newChat.users,
      message: newMessage,
    });

    return newChat;
  }

  @Mutation((returns) => Chat)
  async addMessage(
    @PubSub("NEW_MESSAGE") publishNewMessage: Publisher<NewMessagePayload>,
    @Arg("chatData") { text, chatId }: AddMessageInput,
    @Ctx() ctx: Context
  ): Promise<Chat> {
    if (!ctx.isAuth || !ctx.user) {
      throw new AuthenticationError("User is not authenticated");
    }

    const authUserId = ctx.user._id;

    const chat = await ChatModel.findOne({
      _id: chatId,
      users: {
        $in: [authUserId],
      },
    });

    if (!chat) {
      throw new AuthenticationError("Chat not found");
    }

    const newMessage: Message = {
      _id: new ObjectId(),
      text,
      sender: authUserId,
      users: [...chat.users],
    };
    chat.messages.push(newMessage);
    await chat.save();
    await chat.populate("users");

    await publishNewMessage({
      chatId: chat._id,
      message: newMessage,
      users: chat.users,
      group: chat.group,
    });

    return chat;
  }

  @Subscription({
    topics: "NEW_MESSAGE",
    filter: async ({ payload, args, context }) => {
      if (!context || !context.userId) return false;

      const customPayload = payload as NewMessagePayload;
      const contextUserId = context.userId.toString() as string;

      return customPayload.message.users.some((r) => {
        const recipientId = r.toString();
        return recipientId === contextUserId;
      });
    },
  })
  newMessage(
    @Root() { chatId, message, users, group }: NewMessagePayload
  ): NewMessage {
    return {
      chatId,
      message,
      users,
      group,
    };
  }
}
