import { ObjectId } from "mongodb";
import { FilterQuery } from "mongoose";
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
  UseMiddleware,
} from "type-graphql";
import {
  ValidationError,
  UserInputError,
  ApolloError,
} from "apollo-server-express";
import { hash as hashPassword, compare as comparePasswords } from "bcryptjs";
import { FileUpload, GraphQLUpload } from "graphql-upload";

import { UserModel, User } from "../../schemas/user";
import {
  AuthUser,
  CreateUserInput,
  GetUsersInput,
  LoggedInUser,
  LoginUserArgs,
  UpdateUserArgs,
} from "./types";
import { Context, JwtPayload } from "../../types";
import {
  createRefreshToken,
  createAccessToken,
  sendRefreshToken,
  getUserIdWithToken,
} from "../../utils/auth";
import { deleteFromCloudinary, uploadToCloudinary } from "../../utils/upload";
import { IsAuthenticated } from "../middlewares/isAuth";

@Resolver((of) => User)
export class UserResolver {
  @Query((returns) => [User])
  @UseMiddleware(IsAuthenticated)
  async getUsers(
    @Ctx() ctx: Context,
    @Arg("searchOptions")
    { searchText, limit, offset, excludedUsers }: GetUsersInput
  ): Promise<User[]> {
    const authUserId = ctx.payload!.userId;

    let filterQuery: FilterQuery<User> = {
      _id: { $not: { $eq: authUserId } },
    };

    const trimmedSearchText = searchText.trim();
    if (trimmedSearchText.length > 0) {
      const searchRegex = new RegExp(trimmedSearchText, "i");
      filterQuery = {
        ...filterQuery,
        $or: [{ fullname: searchRegex }, { username: searchRegex }],
      };
    }

    if (excludedUsers) {
      filterQuery = {
        ...filterQuery,
        _id: { $nin: [authUserId, ...excludedUsers] },
      };
    }

    /* 
      GOALS:
        1. Implement the logic to support offset-based pagination.
        2. Add the field "isNewUser" whose value is true when the difference in days 
        between the current date and its creation date is less than or equal to 1  
    */
    const usersAgg = await UserModel.aggregate([
      {
        $match: {
          ...filterQuery,
        },
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $skip: offset,
      },
      {
        $limit: limit,
      },
      {
        $set: {
          daysDiff: {
            $round: {
              $divide: [{ $subtract: ["$$NOW", "$createdAt"] }, 86400000],
            },
          },
        },
      },
      {
        $set: {
          isNewUser: { $lte: ["$daysDiff", 1] },
        },
      },
      {
        $unset: "daysDiff",
      },
    ]);

    return usersAgg;
  }

  @Query((returns) => AuthUser)
  async getAuthUser(@Ctx() ctx: Context): Promise<AuthUser> {
    const bearerToken = ctx.req.header("authorization");
    if (!bearerToken) {
      return { isAuth: false, user: null };
    }

    const authUserId = getUserIdWithToken(bearerToken);
    if (!authUserId) {
      return { isAuth: false, user: null };
    }

    const authUser = await UserModel.findById(authUserId);
    if (!authUser) {
      return { isAuth: false, user: null };
    }

    return { isAuth: true, user: authUser };
  }

  @Query((returns) => User)
  @UseMiddleware(IsAuthenticated)
  async getUser(@Arg("username") username: string): Promise<User> {
    const user = await UserModel.findOne({
      username,
    });

    if (!user) {
      throw new ValidationError("User not found");
    }

    return user;
  }

  @Mutation((returns) => LoggedInUser)
  async loginUser(
    @Args() { email, password }: LoginUserArgs,
    @Ctx() ctx: Context
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

    const tokenData: JwtPayload = {
      userId: foundUserObj._id,
      username: foundUserObj.username,
    };

    const refreshToken = createRefreshToken(tokenData);
    sendRefreshToken(ctx.res, refreshToken);

    const token = createAccessToken(tokenData);

    return { user: foundUserObj, token };
  }

  @Mutation((returns) => User)
  async createUser(
    @PubSub("NEW_USER") publish: Publisher<User>,
    @Arg("newUser") { email, fullname, username, password }: CreateUserInput
  ): Promise<User> {
    const userExists = await UserModel.findOne({
      $or: [{ email }, { username }],
    });

    if (userExists) {
      const isUsernameInUse = userExists.username === username;
      const message = isUsernameInUse
        ? "The username is already in use"
        : "The email is already in use";

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
      ...user.toObject(),
    });

    return user;
  }

  @Mutation((returns) => Boolean)
  logout(@Ctx() ctx: Context) {
    sendRefreshToken(ctx.res, "");
    return true;
  }

  @Mutation((returns) => User)
  @UseMiddleware(IsAuthenticated)
  async updateUser(
    @Ctx() ctx: Context,
    @Args() { fullname, description }: UpdateUserArgs
  ): Promise<User> {
    const authUserId = ctx.payload!.userId;

    const updatedUser = await UserModel.findByIdAndUpdate(
      authUserId,
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
  @UseMiddleware(IsAuthenticated)
  async uploadProfileImage(
    @Ctx() ctx: Context,
    @Arg("file", () => GraphQLUpload)
    file: FileUpload
  ): Promise<User> {
    const authUserId = ctx.payload!.userId;

    const authUser = await UserModel.findById(authUserId);
    if (!authUser) {
      throw new ApolloError("Couldn't upload profile image");
    }

    const uploadedFile = await uploadToCloudinary(file, { folder: "profile" });
    if (!uploadedFile) {
      throw new ApolloError("Couldn't upload profile image");
    }

    const olderImagePublicId = authUser.profileImg
      ? authUser.profileImg.publicId
      : null;

    authUser.profileImg = {
      _id: new ObjectId(),
      publicId: uploadedFile.public_id,
      url: uploadedFile.secure_url,
    };
    await authUser.save();

    if (olderImagePublicId) {
      await deleteFromCloudinary(olderImagePublicId);
    }

    return authUser;
  }

  @Mutation((returns) => User)
  @UseMiddleware(IsAuthenticated)
  async deleteProfileImage(@Ctx() ctx: Context): Promise<User> {
    const authUserId = ctx.payload!.userId;
    const user = await UserModel.findById(authUserId);

    if (!user || !user.profileImg) {
      throw new ApolloError("Couldn't delete profile image");
    }

    await deleteFromCloudinary(user.profileImg.publicId);

    user.profileImg = undefined;
    await user.save();

    return user;
  }

  @Subscription({
    topics: "NEW_USER",
    filter: async ({ payload, args, context }) => {
      if (!context || !context.userId) return false;
      return true;
    },
  })
  newUser(@Root() newUser: User): User {
    return {
      ...newUser,
      isNewUser: true,
    };
  }
}
