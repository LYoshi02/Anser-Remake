import { Resolver, Mutation, Arg, Query, Args, Ctx } from "type-graphql";
import { ValidationError, UserInputError } from "apollo-server-express";
import { hash as hashPassword, compare as comparePasswords } from "bcryptjs";

import { UserModel, User } from "../schemas/user";
import { CreateUserInput, LoginUserArgs } from "./types/user";

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

  @Query((returns) => User)
  async loginUser(
    @Args() { email, password }: LoginUserArgs,
    @Ctx() ctx: any
  ): Promise<User> {
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

    return foundUser;
  }
}
