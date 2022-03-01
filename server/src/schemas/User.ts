import { ObjectId } from "mongoose";
import { getModelForClass, prop as Property } from "@typegoose/typegoose";
import { Field, ObjectType, InputType, ID } from "type-graphql";

@ObjectType()
export class User {
  @Field((type) => ID)
  readonly _id: ObjectId;

  @Field()
  @Property({ unique: true, trim: true })
  email: string;

  @Field()
  @Property({ unique: true, minLength: 3, maxLength: 20, trim: true })
  username: string;

  @Field()
  @Property({ minLength: 3, maxLength: 30, trim: true })
  fullname: string;

  @Field({ nullable: true })
  @Property({ default: null, trim: true })
  description?: string;

  @Field()
  password: string;
}

export const UserModel = getModelForClass(User);

@InputType()
export class AddUserInput implements Partial<User> {
  @Field()
  email: string;

  @Field()
  username: string;

  @Field()
  fullname: string;

  @Field()
  password: string;
}
