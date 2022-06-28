import { Min } from "class-validator";
import { ObjectId } from "mongodb";
import { ArgsType, Field, InputType, Int } from "type-graphql";
import { User } from "../../schemas/user";

@InputType()
export class CreateUserInput implements Partial<User> {
  @Field()
  email: string;

  @Field()
  username: string;

  @Field()
  fullname: string;

  @Field()
  password: string;
}

@ArgsType()
export class LoginUserArgs {
  @Field()
  email: string;

  @Field()
  password: string;
}

@ArgsType()
export class UpdateUserArgs {
  @Field()
  fullname: string;

  @Field()
  description: string;
}

export interface NewUserPayload {
  _id: ObjectId;
  username: string;
  fullname: string;
}

@ArgsType()
export class GetUsersArgs {
  @Field()
  searchText: string;

  @Field((type) => Int)
  @Min(0)
  offset: number;

  @Field((type) => Int)
  @Min(0)
  limit: number;
}
