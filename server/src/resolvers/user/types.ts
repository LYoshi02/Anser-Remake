import { IsEmail, Matches, MaxLength, Min, MinLength } from "class-validator";
import { ObjectId } from "mongodb";
import { ArgsType, Field, InputType, Int } from "type-graphql";

import { User } from "../../schemas/user";
import { ObjectIdScalar } from "../../utils/objectId.scalar";

@InputType()
export class CreateUserInput implements Partial<User> {
  @Field()
  @IsEmail({}, { message: "Invalid email" })
  email: string;

  @Field()
  @MinLength(3, { message: "The username must be at least 3 characters long" })
  @MaxLength(30, { message: "The username must be at most 20 characters long" })
  @Matches(/^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/gim, {
    message: "The username is not valid",
  })
  username: string;

  @Field()
  @MinLength(3, { message: "The name must be at least 3 characters long" })
  @MaxLength(30, { message: "The name must be at most 30 characters long" })
  fullname: string;

  @Field()
  @Min(8, { message: "The password must be at least 8 characters long" })
  password: string;
}

@ArgsType()
export class LoginUserArgs {
  @Field()
  @IsEmail({}, { message: "Invalid email" })
  email: string;

  @Field()
  password: string;
}

@ArgsType()
export class UpdateUserArgs {
  @Field()
  @MinLength(3, { message: "The name must be at least 3 characters long" })
  @MaxLength(30, { message: "The name must be at most 30 characters long" })
  fullname: string;

  @Field()
  @MaxLength(160, {
    message: "The description must be at most 160 characters long",
  })
  description: string;
}

@InputType()
export class GetUsersInput {
  @Field()
  searchText: string;

  @Field((type) => Int)
  @Min(0)
  offset: number;

  @Field((type) => Int)
  @Min(0)
  limit: number;

  @Field((type) => [ObjectIdScalar], { nullable: true })
  excludedUsers?: ObjectId[];
}
