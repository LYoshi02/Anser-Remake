import { AuthenticationError, ValidationError } from "apollo-server-express";
import {
  Query,
  Resolver,
  Ctx,
  Mutation,
  Arg,
  Publisher,
  PubSub,
  Subscription,
  Root,
} from "type-graphql";
import { ObjectId } from "mongodb";

import { Context } from "../types";
import {
  AddMessageInput,
  NewChatPayload,
  NewMessagePayload,
} from "./types/chat";
import { Chat, ChatModel, NewMessage } from "../schemas/chat";
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
    @PubSub("NEW_MESSAGE") publishNewMessage: Publisher<NewMessagePayload>,
    @PubSub("NEW_CHAT") publishNewChat: Publisher<NewChatPayload>,
    @Arg("chatData") { recipients, text, chatId }: AddMessageInput,
    @Ctx() ctx: Context
  ): Promise<Chat> {
    if (!ctx.isAuth || !ctx.user) {
      throw new AuthenticationError("User is not authenticated");
    }

    const authUserId = ctx.user._id;

    const chatUsers = [...recipients];
    const authUserExists = chatUsers.some((id) => authUserId === id);
    if (!authUserExists) {
      chatUsers.push(authUserId);
    }

    let chat = await ChatModel.findOne({
      _id: chatId,
      users: {
        $in: [authUserId],
      },
    });

    let isNewChat = false;
    if (!chat) {
      chat = new ChatModel({
        users: chatUsers,
      });
      await chat.populate("users");
      isNewChat = true;
    }

    const newMessage: Message = {
      _id: new ObjectId(),
      text,
      sender: authUserId,
    };

    chat.messages.push(newMessage);
    await chat.save();

    if (isNewChat) {
      publishNewChat({
        _id: chat._id,
        users: chat.users,
        messages: chat.messages,
        recipients: chatUsers,
      });
    } else {
      publishNewMessage({
        chatId: chat._id,
        message: newMessage,
        recipients: chatUsers,
      });
    }

    return chat;
  }

  @Subscription({
    topics: "NEW_CHAT",
    filter: ({ payload, args, context }) => {
      if (!context) return false;

      const customPayload = payload as NewChatPayload;
      return customPayload.recipients.some(
        (u) => u.toString() === context.userId.toString()
      );
    },
  })
  newChat(@Root() newChatPayload: NewChatPayload): Chat {
    return {
      ...newChatPayload,
    };
  }

  @Subscription({
    topics: "NEW_MESSAGE",
    filter: async ({ payload, args, context }) => {
      if (!context || !context.userId) return false;

      // Logs to see what is in the arguments
      // console.log("PAYLOAD");
      // console.log(payload);
      // console.log("ARGS");
      // console.log(args);
      // console.log("CONTEXT");
      // console.log(context);

      const customPayload = payload as NewMessagePayload;
      const contextUserId = context.userId.toString();

      return customPayload.recipients.some((r) => {
        const recipientId = r.toString();
        return recipientId === contextUserId;
      });
    },
  })
  newMessage(@Root() { chatId, message }: NewMessagePayload): NewMessage {
    return {
      chatId,
      message,
    };
  }
}
