import { Resolver, Mutation, Arg, Query, Args, Ctx } from "type-graphql";
import {
  ValidationError,
  UserInputError,
  AuthenticationError,
} from "apollo-server-express";
import { hash as hashPassword, compare as comparePasswords } from "bcryptjs";

import { UserModel, User, LoggedInUser, AuthUser } from "../schemas/user";
import { CreateUserInput, LoginUserArgs } from "./types/user";
import { Context } from "../types";
import { issueAuthToken } from "../utils/user";

@Resolver((of) => User)
export class UserResolver {
  @Mutation((returns) => User)
  async createUser(
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
    if (!ctx.isAuth || !ctx.user) {
      return {
        isAuth: false,
        user: undefined,
      };
    }

    const { _id, description, email, fullname, username } = ctx.user;

    return {
      isAuth: true,
      user: { _id, description, email, fullname, username },
    };
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
