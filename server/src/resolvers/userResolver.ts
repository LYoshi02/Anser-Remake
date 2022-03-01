import { Resolver, Mutation, Arg, Query } from "type-graphql";
import { AddUserInput, UserModel, User } from "../schemas/User";

@Resolver((of) => User)
export class UserResolver {
  @Mutation((returns) => User)
  async addUser(@Arg("user") newUser: AddUserInput): Promise<User> {
    const user = new UserModel({
      ...newUser,
    });

    await user.save();

    return user;
  }

  @Query((returns) => User)
  async getUser(
    @Arg("email") email: string,
    @Arg("password") password: string
  ): Promise<User> {
    const foundUser = await UserModel.findOne({ email, password });

    if (!foundUser) {
      throw new Error("User not found");
    }

    return foundUser;
  }
}
