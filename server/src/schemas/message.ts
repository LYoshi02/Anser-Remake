import { prop as Property } from "@typegoose/typegoose";
import { ObjectId } from "mongodb";
import { Field, ObjectType } from "type-graphql";
import { Ref } from "../types";

import { User } from "./user";

@ObjectType()
export class Message {
  @Field()
  readonly _id: ObjectId;

  @Field((type) => User)
  @Property({ ref: User, required: true })
  sender: Ref<User>;

  @Field()
  @Property({ required: true, minLength: 1, trim: true })
  text: string;

  @Field()
  @Property({ default: Date.now() })
  createdAt?: Date;
}
