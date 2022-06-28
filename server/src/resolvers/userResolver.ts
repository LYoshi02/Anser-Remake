import { ObjectId } from "mongodb";
import {
  Resolver,
  Mutation,
  Arg,
  Query,
  Args,
  Ctx,
  Subscription,
  Root,
  PubSub,
  Publisher,
} from "type-graphql";
import {
  ValidationError,
  UserInputError,
  AuthenticationError,
  ApolloError,
} from "apollo-server-express";
import { hash as hashPassword, compare as comparePasswords } from "bcryptjs";
import { FileUpload, GraphQLUpload } from "graphql-upload";

import {
  UserModel,
  User,
  LoggedInUser,
  AuthUser,
  NewUser,
} from "../schemas/user";
import {
  CreateUserInput,
  LoginUserArgs,
  NewUserPayload,
  UpdateUserArgs,
} from "./types/user";
import { Context } from "../types";
import { issueAuthToken } from "../utils/user";
import { deleteFromCloudinary, uploadToCloudinary } from "../utils/upload";

@Resolver((of) => User)
export class UserResolver {
  @Mutation((returns) => User)
  async createUser(
    @PubSub("NEW_USER") publish: Publisher<NewUserPayload>,
    @Arg("newUser") { email, fullname, username, password }: CreateUserInput
  ): Promise<User> {
    const userExists = await UserModel.findOne({
      $or: [{ email }, { username }],
    });

    if (userExists) {
      let message = "The email is already in use";
      if (userExists.username === username) {
        message = "The username is already in use";
      }

      throw new ValidationError(message);
    }

    const hashedPassword = await hashPassword(password, 10);
    const user = new UserModel({
      email,
      fullname,
      username,
      password: hashedPassword,
    });

    await user.save();

    await publish({
      _id: user._id,
      fullname: user.fullname,
      username: user.username,
    });

    return user;
  }

  @Subscription({
    topics: "NEW_USER",
    filter: async ({ payload, args, context }) => {
      if (!context || !context.userId) return false;
      return true;
    },
  })
  newUser(@Root() newUserPayload: NewUserPayload): NewUser {
    console.log("Sending new user data.");
    return newUserPayload;
  }

  @Mutation((returns) => User)
  async updateUser(
    @Ctx() ctx: Context,
    @Args() { fullname, description }: UpdateUserArgs
  ): Promise<User> {
    if (!ctx.isAuth || !ctx.user) {
      throw new AuthenticationError("User is not authenticated");
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      ctx.user._id,
      {
        $set: { fullname, description },
      },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      throw new ApolloError("Couldn't update user");
    }

    return updatedUser;
  }

  @Mutation((returns) => User)
  async uploadProfileImage(
    @Ctx() ctx: Context,
    @Arg("file", () => GraphQLUpload)
    file: FileUpload
  ): Promise<User> {
    if (!ctx.isAuth || !ctx.user) {
      throw new AuthenticationError("User is not authenticated");
    }

    const user = await UserModel.findById(ctx.user._id);

    if (!user) {
      throw new ApolloError("Couldn't upload profile image");
    }

    const uploadedFile = await uploadToCloudinary(file, { folder: "profile" });
    if (!uploadedFile) {
      throw new ApolloError("Couldn't upload profile image");
    }

    const olderImagePublicId = user.profileImg
      ? user.profileImg.publicId
      : null;

    user.profileImg = {
      _id: new ObjectId(),
      publicId: uploadedFile.public_id,
      url: uploadedFile.secure_url,
    };
    await user.save();

    if (olderImagePublicId) {
      await deleteFromCloudinary(olderImagePublicId);
    }

    return user;
  }

  @Mutation((returns) => User)
  async deleteProfileImage(@Ctx() ctx: Context): Promise<User> {
    if (!ctx.isAuth || !ctx.user) {
      throw new AuthenticationError("User is not authenticated");
    }

    const user = await UserModel.findById(ctx.user._id);

    if (!user || !user.profileImg) {
      throw new ApolloError("Couldn't delete profile image");
    }

    await deleteFromCloudinary(user.profileImg.publicId);

    user.profileImg = undefined;
    await user.save();

    return user;
  }

  @Query((returns) => LoggedInUser)
  async loginUser(
    @Args() { email, password }: LoginUserArgs
  ): Promise<LoggedInUser> {
    const foundUser = await UserModel.findOne({ email });

    if (!foundUser) {
      throw new UserInputError("Email or password are not valid");
    }

    const passwordsDoMatch = await comparePasswords(
      password,
      foundUser.password
    );
    if (!passwordsDoMatch) {
      throw new UserInputError("Email or password are not valid");
    }

    const foundUserObj = foundUser.toObject();

    const token = issueAuthToken({ _id: foundUserObj._id });

    return { user: foundUserObj, token };
  }

  @Query((returns) => [User])
  async getUsers(@Ctx() ctx: Context): Promise<User[]> {
    if (!ctx.isAuth || !ctx.user) {
      throw new AuthenticationError("User is not authenticated");
    }

    const users = await UserModel.find({
      _id: { $not: { $eq: ctx.user._id } },
    });

    return users;
  }

  @Query((returns) => AuthUser)
  async getAuthUser(@Ctx() ctx: Context): Promise<AuthUser> {
    if (ctx.user) {
      ctx.user.password = "";
    }

    return ctx;
  }

  @Query((returns) => User)
  async getUser(
    @Arg("username") username: string,
    @Ctx() ctx: Context
  ): Promise<User> {
    if (!ctx.isAuth || !ctx.user) {
      throw new AuthenticationError("User is not authenticated");
    }

    const user = await UserModel.findOne({
      username,
    });

    if (!user) {
      throw new ValidationError("User not found");
    }

    return user;
  }
}
