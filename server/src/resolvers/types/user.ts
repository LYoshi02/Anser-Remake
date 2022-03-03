import { ArgsType, Field, InputType } from "type-graphql";
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
