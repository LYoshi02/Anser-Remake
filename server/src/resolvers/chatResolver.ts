import {
  ApolloError,
  AuthenticationError,
  ValidationError,
} from "apollo-server-express";
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
import { FileUpload, GraphQLUpload } from "graphql-upload";

import { Context } from "../types";
import {
  AddMessageInput,
  AddUsersToGroupInput,
  ChangeGroupNameArgs,
  GroupOperationInput,
  NewChatInput,
  NewGroupInput,
  NewMessagePayload,
} from "./types/chat";
import { Chat, ChatModel, NewMessage } from "../schemas/chat";
import { Message } from "../schemas/message";
import { UserModel } from "../schemas/user";
import { generateChatUsersArr, generateUniqueValuesArr } from "../utils/chat";
import { deleteFromCloudinary, uploadToCloudinary } from "../utils/upload";

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

    /*
      GOAL: the property "messages" of the chat must contain only the messages the 
      authenticated user received.
    */
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
    ]);

    const populatedChat = await ChatModel.populate(chat, {
      path: "messages.sender",
    });

    if (populatedChat.length === 0) {
      throw new ValidationError("Chat not found");
    }

    return populatedChat[0];
  }

  @Query((returns) => Chat)
  async getGroupData(
    @Arg("chatId") chatId: string,
    @Ctx() ctx: Context
  ): Promise<Chat> {
    if (!ctx.isAuth || !ctx.user) {
      throw new AuthenticationError("User is not authenticated");
    }

    const authUserId = ctx.user._id;

    const chat = await ChatModel.findOne({
      _id: chatId,
      users: { $in: [authUserId] },
      group: { $ne: null },
    }).populate("users");

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

      // Logs to see what is in the arguments
      // console.log("PAYLOAD");
      // console.log(payload);
      // console.log("ARGS");
      // console.log(args);
      // console.log("CONTEXT");
      // console.log(context);

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

  @Mutation((returns) => Chat)
  async createNewGroup(
    @PubSub("NEW_MESSAGE") publishNewMessage: Publisher<NewMessagePayload>,
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

    await publishNewMessage({
      chatId: chat._id,
      users: chat.users,
      message: newMessage,
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
    const authUserIdString = authUserId.toString();

    const chat = await ChatModel.findOne({
      _id: chatId,
      users: {
        $in: [authUserId],
      },
      group: {
        $ne: null,
      },
    });

    if (!chat) {
      throw new ValidationError("Chat not found");
    }

    const groupUsers = [...chat.users];
    const groupAdmins = [...chat.group!.admins];
    const isAdmin = groupAdmins.some((u) => u.toString() === authUserIdString);

    if (isAdmin) {
      const updatedAdmins = groupAdmins.filter(
        (a) => a.toString() !== authUserIdString
      );

      if (updatedAdmins.length === 0 && groupUsers.length > 1) {
        const newAdmin = groupUsers.find(
          (u) => u.toString() !== authUserIdString
        );

        if (!newAdmin) {
          throw new ApolloError("There was an error");
        }

        updatedAdmins.push(newAdmin);
      }

      chat.group!.admins = updatedAdmins;
    }

    const updatedGroupUsers = groupUsers.filter(
      (u) => u.toString() !== authUserId.toString()
    );

    const newMessage: Message = {
      _id: new ObjectId(),
      text: `@${ctx.user.username} left the group`,
      sender: null,
      users: groupUsers,
    };

    chat.users = updatedGroupUsers;
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

  @Mutation((returns) => Chat)
  async addUsersToGroup(
    @PubSub("NEW_MESSAGE") publishNewMessage: Publisher<NewMessagePayload>,
    @Arg("addUsersArgs") { chatId, newUsers }: AddUsersToGroupInput,
    @Ctx() ctx: Context
  ): Promise<Chat> {
    if (!ctx.isAuth || !ctx.user) {
      throw new AuthenticationError("User is not authenticated");
    }

    const authUserId = ctx.user._id;
    const authUserIdString = authUserId.toString();

    const chat = await ChatModel.findOne({
      _id: chatId,
      users: {
        $in: [authUserId],
        $nin: newUsers,
      },
      group: {
        $ne: null,
      },
    });

    if (!chat) {
      throw new ValidationError("Chat not found");
    }

    const groupAdmins = [...chat.group!.admins];
    const isAdmin = groupAdmins.some((u) => u.toString() === authUserIdString);

    if (!isAdmin) {
      throw new AuthenticationError(
        "You need admin permissions to add a user to the group"
      );
    }

    const newGroupUsersIds = generateUniqueValuesArr(newUsers);
    const newGroupUsers = await UserModel.find({
      _id: { $in: newGroupUsersIds },
    });

    const groupUsers = [...chat.users];
    const newMessages: Message[] = [];
    newGroupUsers.forEach((newUser) => {
      groupUsers.push(newUser._id);
      newMessages.push({
        _id: new ObjectId(),
        text: `@${ctx.user!.username} added @${newUser.username}`,
        sender: null,
        users: [...groupUsers],
      });
    });

    chat.users = groupUsers;
    chat.messages.push(...newMessages);
    await chat.save();
    await chat.populate("users");

    const newMessagesPromises = newMessages.map(async (newMessage) => {
      console.log(newMessage);
      return await publishNewMessage({
        chatId: chat._id,
        message: newMessage,
        users: chat.users,
        group: chat.group,
      });
    });

    await Promise.all(newMessagesPromises);

    return chat;
  }

  @Mutation((returns) => Chat)
  async appointAdmin(
    @PubSub("NEW_MESSAGE") publishNewMessage: Publisher<NewMessagePayload>,
    @Arg("appointAdminArgs") { chatId, userId: newAdmin }: GroupOperationInput,
    @Ctx() ctx: Context
  ): Promise<Chat> {
    if (!ctx.isAuth || !ctx.user) {
      throw new AuthenticationError("User is not authenticated");
    }

    const authUserId = ctx.user._id;
    const authUserIdString = authUserId.toString();

    const chat = await ChatModel.findOne({
      _id: chatId,
      users: {
        $in: [authUserId, newAdmin],
      },
      group: {
        $ne: null,
      },
      "group.admins": {
        $nin: [newAdmin],
      },
    });

    if (!chat) {
      throw new ValidationError("Chat not found");
    }

    const groupAdmins = [...chat.group!.admins];
    const isAdmin = groupAdmins.some((u) => u.toString() === authUserIdString);

    if (!isAdmin) {
      throw new AuthenticationError(
        "You need admin permissions to add a user to the group"
      );
    }

    const newAdminData = await UserModel.findById(newAdmin, { username: 1 });

    if (!newAdminData) {
      throw new AuthenticationError("The user selected was not found");
    }

    const newMessage: Message = {
      _id: new ObjectId(),
      text: `@${newAdminData.username} is an admin now`,
      sender: null,
      users: [...chat.users],
    };

    groupAdmins.push(newAdmin);
    chat.group!.admins = groupAdmins;
    chat.messages.push(newMessage);
    await chat.save();

    await publishNewMessage({
      chatId: chat._id,
      message: newMessage,
      group: chat.group,
    });

    return chat;
  }

  @Mutation((returns) => Chat)
  async removeAdmin(
    @PubSub("NEW_MESSAGE") publishNewMessage: Publisher<NewMessagePayload>,
    @Arg("removeAdminArgs") { chatId, userId: adminId }: GroupOperationInput,
    @Ctx() ctx: Context
  ): Promise<Chat> {
    if (!ctx.isAuth || !ctx.user) {
      throw new AuthenticationError("User is not authenticated");
    }

    const authUserId = ctx.user._id;
    const authUserIdString = authUserId.toString();

    const chat = await ChatModel.findOne({
      _id: chatId,
      users: {
        $in: [authUserId, adminId],
      },
      group: {
        $ne: null,
      },
      "group.admins": {
        $in: [adminId],
      },
    });

    if (!chat) {
      throw new ValidationError("Chat not found");
    }

    const groupAdmins = [...chat.group!.admins];
    const isAdmin = groupAdmins.some((u) => u.toString() === authUserIdString);

    if (!isAdmin) {
      throw new AuthenticationError(
        "You need admin permissions to add a user to the group"
      );
    }

    const adminData = await UserModel.findById(adminId, { username: 1 });

    if (!adminData) {
      throw new AuthenticationError("The user selected was not found");
    }

    const newMessage: Message = {
      _id: new ObjectId(),
      text: `@${adminData.username} is not an admin anymore`,
      sender: null,
      users: [...chat.users],
    };

    const updatedGroupAdmins = groupAdmins.filter(
      (a) => a.toString() !== adminId.toString()
    );
    chat.group!.admins = updatedGroupAdmins;
    chat.messages.push(newMessage);
    await chat.save();

    await publishNewMessage({
      chatId: chat._id,
      message: newMessage,
      group: chat.group,
    });

    return chat;
  }

  @Mutation((returns) => Chat)
  async removeFromGroup(
    @PubSub("NEW_MESSAGE") publishNewMessage: Publisher<NewMessagePayload>,
    @Arg("removeFromGroupArgs") { chatId, userId }: GroupOperationInput,
    @Ctx() ctx: Context
  ): Promise<Chat> {
    if (!ctx.isAuth || !ctx.user) {
      throw new AuthenticationError("User is not authenticated");
    }

    const authUserId = ctx.user._id;
    const authUserIdString = authUserId.toString();
    const userIdString = userId.toString();

    if (authUserIdString === userIdString) {
      throw new AuthenticationError(
        "You cannot remove yourself from the group"
      );
    }

    const chat = await ChatModel.findOne({
      _id: chatId,
      users: {
        $in: [authUserId, userId],
      },
      group: {
        $ne: null,
      },
    });

    if (!chat) {
      throw new ValidationError("Chat not found");
    }

    const groupAdmins = [...chat.group!.admins];
    const isAuthUserAdmin = groupAdmins.some(
      (u) => u.toString() === authUserIdString
    );

    if (!isAuthUserAdmin) {
      throw new AuthenticationError(
        "You need admin permissions to add a user to the group"
      );
    }

    const userData = await UserModel.findById(userId, { username: 1 });

    if (!userData) {
      throw new AuthenticationError("The user selected was not found");
    }

    const newMessage: Message = {
      _id: new ObjectId(),
      text: `@${ctx.user.username} removed @${userData.username}`,
      sender: null,
      users: [...chat.users],
    };

    const updatedGroupAdmins = groupAdmins.filter(
      (a) => a.toString() !== userIdString
    );
    const updatedGroupUsers = chat.users.filter(
      (u) => u.toString() !== userIdString
    );
    chat.group!.admins = updatedGroupAdmins;
    chat.users = updatedGroupUsers;
    chat.messages.push(newMessage);
    await chat.save();
    await chat.populate("users");

    await publishNewMessage({
      chatId: chat._id,
      message: newMessage,
      group: chat.group,
      users: chat.users,
    });

    return chat;
  }

  @Mutation((returns) => Chat)
  async setGroupImage(
    @PubSub("NEW_MESSAGE") publishNewMessage: Publisher<NewMessagePayload>,
    @Arg("chatId") chatId: ObjectId,
    @Arg("file", () => GraphQLUpload) file: FileUpload,
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
      group: {
        $ne: null,
      },
    });

    if (!chat) {
      throw new ValidationError("Chat not found");
    }

    const uploadedFile = await uploadToCloudinary(file, { folder: "group" });
    if (!uploadedFile) {
      throw new ApolloError("Couldn't upload group image");
    }

    const olderImagePublicId = chat.group!.image?.publicId;
    const newImage = {
      _id: new ObjectId(),
      publicId: uploadedFile.public_id,
      url: uploadedFile.secure_url,
    };
    const newMessage: Message = {
      _id: new ObjectId(),
      sender: null,
      users: chat.users,
      text: `${ctx.user.username} changed the group's image`,
    };

    chat.group!.image = newImage;
    chat.messages.push(newMessage);
    await chat.save();

    if (olderImagePublicId) {
      await deleteFromCloudinary(olderImagePublicId);
    }

    await publishNewMessage({
      chatId: chat._id,
      message: newMessage,
      group: chat.group,
    });

    return chat;
  }

  @Mutation((returns) => Chat)
  async deleteGroupImage(
    @PubSub("NEW_MESSAGE") publishNewMessage: Publisher<NewMessagePayload>,
    @Arg("chatId") chatId: ObjectId,
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
      group: {
        $ne: null,
      },
    });

    if (!chat) {
      throw new ValidationError("Chat not found");
    }

    const currentImagePublicId = chat.group!.image?.publicId;

    if (!currentImagePublicId) {
      throw new ValidationError("The group doesn't have an image");
    }

    await deleteFromCloudinary(currentImagePublicId);

    const newMessage: Message = {
      _id: new ObjectId(),
      sender: null,
      users: chat.users,
      text: `${ctx.user.username} deleted the group's image`,
    };

    chat.group!.image = undefined;
    chat.messages.push(newMessage);
    await chat.save();

    await publishNewMessage({
      chatId: chat._id,
      message: newMessage,
      group: chat.group,
    });

    return chat;
  }

  @Mutation((returns) => Chat)
  async changeGroupName(
    @PubSub("NEW_MESSAGE") publishNewMessage: Publisher<NewMessagePayload>,
    @Arg("changeGroupNameArgs") { chatId, newName }: ChangeGroupNameArgs,
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
      group: {
        $ne: null,
      },
    });

    if (!chat) {
      throw new ValidationError("Chat not found");
    }

    const previousName = chat.group!.name;
    const newMessage: Message = {
      _id: new ObjectId(),
      text: `@${ctx.user.username} changed group's name from ${previousName} to ${newName}`,
      sender: null,
      users: [...chat.users],
    };

    chat.group!.name = newName;
    chat.messages.push(newMessage);
    await chat.save();

    await publishNewMessage({
      chatId: chat._id,
      message: newMessage,
      group: chat.group,
    });

    return chat;
  }
}
