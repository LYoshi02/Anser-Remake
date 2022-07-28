import { prop as Property } from "@typegoose/typegoose";
import { TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";
import { ObjectId } from "mongodb";
import { Field, ObjectType } from "type-graphql";

import { Ref } from "../types";
import { User } from "./user";

@ObjectType()
export class Message extends TimeStamps {
  @Field()
  readonly _id: ObjectId;

  @Field((type) => User, { nullable: true })
  @Property({ ref: User })
  sender: Ref<User> | null;

  @Field((type) => [User])
  @Property({ ref: User, required: true })
  users: Ref<User>[];

  @Field()
  @Property({ required: true, minLength: 1, trim: true })
  text: string;
}
