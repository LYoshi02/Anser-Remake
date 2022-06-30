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
  NewChatInput,
  NewChatPayload,
  NewGroupInput,
  NewMessagePayload,
} from "./types/chat";
import { Chat, ChatModel, NewMessage } from "../schemas/chat";
import { Message } from "../schemas/message";
import { UserModel } from "../schemas/user";
import { generateChatUsersArr } from "../utils/chat";

@Resolver((of) => Chat)
export class ChatResolver {
  // TODO: the last message needs to include the user doing the request withing the "users" property
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

  @Query((returns) => Chat)
  async getGroupChat(
    @Arg("chatId") chatId: string,
    @Ctx() ctx: Context
  ): Promise<Chat> {
    if (!ctx.isAuth || !ctx.user) {
      throw new AuthenticationError("User is not authenticated");
    }

    const chat = await ChatModel.aggregate([
      { $match: { _id: new ObjectId(chatId) } },
      {
        $project: {
          messages: {
            $filter: {
              input: "$messages",
              as: "message",
              cond: { $in: [ctx.user._id, "$$message.users"] },
            },
          },
          users: 1,
          group: 1,
        },
      },
      // {
      //   $lookup: {
      //     from: "users",
      //     localField: "messages.sender",
      //     foreignField: "_id",
      //     as: "sender",
      //   },
      // },
    ]);

    console.log(chat[0].messages);

    const populatedChat = await ChatModel.populate(chat, {
      path: "messages.sender",
    });

    // const chat = await ChatModel.findById(chatId)
    //   .populate("messages.sender")
    //   .exec();

    if (!chat) {
      throw new ValidationError("Chat not found");
    }

    return populatedChat[0];
  }

  @Mutation((returns) => Chat)
  async createNewChat(
    @PubSub("NEW_CHAT") publishNewChat: Publisher<NewChatPayload>,
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

    await publishNewChat({
      _id: newChat._id,
      users: newChat.users,
      messages: newChat.messages,
      recipients: chatUsers,
    });

    return newChat;
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
      users: chat.users,
    };
    chat.messages.push(newMessage);
    await chat.save();

    await publishNewMessage({
      chatId: chat._id,
      message: newMessage,
      recipients: chat.users as ObjectId[],
    });

    return chat;
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
      const contextUserId = context.userId.toString() as string;

      return customPayload.recipients.some((r) => {
        const recipientId = r.toString();
        return recipientId === contextUserId;
      });
    },
  })
  newMessage(
    @Root() { chatId, message, users }: NewMessagePayload
  ): NewMessage {
    return {
      chatId,
      message,
      // users,
    };
  }

  @Mutation((returns) => Chat)
  async createNewGroup(
    @PubSub("NEW_CHAT") publishNewChat: Publisher<NewChatPayload>,
    @Arg("groupData") { groupName, groupMembers }: NewGroupInput,
    @Ctx() ctx: Context
  ): Promise<Chat> {
    if (!ctx.isAuth || !ctx.user) {
      throw new AuthenticationError("User is not authenticated");
    }

    const authUserId = ctx.user._id;
    const chatUsers = generateChatUsersArr(groupMembers, authUserId);

    const newMessage: Message = {
      _id: new ObjectId(),
      text: `@${ctx.user.username} created the group "${groupName}"`,
      sender: null,
      users: chatUsers,
    };

    const chat = new ChatModel({
      users: chatUsers,
      messages: [newMessage],
      group: {
        admins: [authUserId],
        name: groupName,
        image: null,
      },
    });
    await chat.populate("users");
    await chat.save();

    await publishNewChat({
      _id: chat._id,
      users: chat.users,
      messages: chat.messages,
      recipients: chatUsers,
      group: chat.group,
    });

    return chat;
  }

  @Mutation((returns) => Chat)
  async leaveGroup(
    @PubSub("NEW_MESSAGE") publishNewMessage: Publisher<NewMessagePayload>,
    @Arg("chatId") chatId: string,
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
      throw new ValidationError("Chat not found");
    }

    const previousChatUsers = [...chat.users];
    const updatedChatUsers = previousChatUsers.filter(
      (u) => u.toString() !== authUserId.toString()
    );

    const newMessage: Message = {
      _id: new ObjectId(),
      text: `@${ctx.user.username} left the group`,
      sender: null,
      users: previousChatUsers,
    };

    chat.users = updatedChatUsers;
    chat.messages.push(newMessage);
    await chat.save();

    await publishNewMessage({
      chatId: chat._id,
      message: newMessage,
      recipients: previousChatUsers as ObjectId[],
      users: updatedChatUsers,
    });

    return chat;
  }
}
