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
  UseMiddleware,
} from "type-graphql";
import { ObjectId } from "mongodb";

import { Context } from "../../types";
import {
  AddMessageInput,
  NewChatInput,
  NewMessage,
  NewMessagePayload,
  SingleChat,
} from "./types";
import { Chat, ChatModel } from "../../schemas/chat";
import { Message } from "../../schemas/message";
import { UserModel } from "../../schemas/user";
import { generateChatUsersArr, getUpdatedLastSeenArr } from "./utils";
import { IsAuthenticated } from "../middlewares/isAuth";
import { ObjectIdScalar } from "../../utils/objectId.scalar";

@Resolver((of) => Chat)
export class ChatResolver {
  @Query((returns) => [Chat])
  @UseMiddleware(IsAuthenticated)
  async getChats(@Ctx() ctx: Context): Promise<Chat[]> {
    const authUserId = ctx.payload!.userId;

    /*
      STEPS: 
      1. Filter user’s chats including those whose “users” property contains the id 
      of the authenticated user or those that contain a message sent by him.
      2. The messages are filtered so the field only contains those sent by the user.
      (important for the group chats)
      3. Get the chat's last seen of the user 
      4. Count unread messages based on the chat's last seen date and messages' sender.
      5. The property "messages" of each chat contains just the last message for 
      preview reasons.
      6. The chats are sorted based on the creation date of the last message
    */
    const chats = await ChatModel.aggregate([
      {
        $match: {
          $or: [
            { users: { $in: [authUserId] } },
            { "messages.users": { $in: [authUserId] } },
          ],
        },
      },
      {
        $addFields: {
          messages: {
            $filter: {
              input: "$messages",
              as: "message",
              cond: { $in: [authUserId, "$$message.users"] },
            },
          },
        },
      },
      {
        $addFields: {
          userLastSeen: {
            $first: {
              $filter: {
                input: "$lastSeen",
                as: "lastSeenElement",
                cond: {
                  $eq: [authUserId, "$$lastSeenElement.user"],
                },
              },
            },
          },
        },
      },
      {
        $addFields: {
          unreadMessages: {
            $size: {
              $filter: {
                input: "$messages",
                as: "message",
                cond: {
                  $and: [
                    {
                      $gt: ["$$message.createdAt", "$userLastSeen.date"],
                    },
                    { $ne: [null, "$$message.sender"] },
                    { $ne: [authUserId, "$$message.sender"] },
                  ],
                },
              },
            },
          },
        },
      },
      {
        $addFields: {
          messages: [
            {
              $last: "$messages",
            },
          ],
        },
      },
      {
        $sort: {
          "messages.createdAt": -1,
        },
      },
    ]);

    const populatedChats = await ChatModel.populate(chats, {
      path: "users",
    });

    return populatedChats;
  }

  @Query((returns) => SingleChat)
  @UseMiddleware(IsAuthenticated)
  async getSingleChat(
    @Arg("recipientUsername") recipientUsername: string,
    @Ctx() ctx: Context
  ): Promise<SingleChat> {
    const authUserId = ctx.payload!.userId;
    const recipient = await UserModel.findOne({ username: recipientUsername });

    if (!recipient) {
      throw new ValidationError("User not found");
    }

    const chat = await ChatModel.findOne({
      users: { $all: [authUserId, recipient._id], $size: 2 },
      group: null,
    })
      .populate("messages.sender")
      .exec();

    if (chat) {
      const updatedLastSeenArr = getUpdatedLastSeenArr(
        chat.lastSeen,
        authUserId
      );
      chat.lastSeen = updatedLastSeenArr;
      await chat.save();
    }

    return { chat, recipient };
  }

  @Mutation((returns) => Boolean)
  @UseMiddleware(IsAuthenticated)
  async updateChatLastSeen(
    @Arg("chatId", (type) => ObjectIdScalar) chatId: ObjectId,
    @Ctx() ctx: Context
  ) {
    const authUserId = ctx.payload!.userId;

    const chat = await ChatModel.findOne({
      _id: chatId,
      users: { $in: [authUserId] },
    });

    if (!chat) {
      throw new AuthenticationError("Chat not found");
    }

    const updatedLastSeenArr = getUpdatedLastSeenArr(chat.lastSeen, authUserId);
    chat.lastSeen = updatedLastSeenArr;
    await chat.save();

    return true;
  }

  @Mutation((returns) => Chat)
  @UseMiddleware(IsAuthenticated)
  async createNewChat(
    @PubSub("NEW_MESSAGE") publishNewMessage: Publisher<NewMessagePayload>,
    @Arg("chatData") { recipients, text }: NewChatInput,
    @Ctx() ctx: Context
  ): Promise<Chat> {
    const authUserId = ctx.payload!.userId;
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
      lastConnections: [
        {
          user: authUserId,
          date: new Date(),
        },
      ],
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
  @UseMiddleware(IsAuthenticated)
  async addMessage(
    @PubSub("NEW_MESSAGE") publishNewMessage: Publisher<NewMessagePayload>,
    @Arg("chatData") { text, chatId }: AddMessageInput,
    @Ctx() ctx: Context
  ): Promise<Chat> {
    const authUserId = ctx.payload!.userId;

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
