import { ObjectId } from "mongodb";
import { getModelForClass, prop as Property } from "@typegoose/typegoose";
import { Field, ObjectType } from "type-graphql";

import { User } from "./user";
import { Message } from "./message";
import { Ref } from "../types";
import { Group } from "./group";

@ObjectType()
export class UserLastSeen {
  @Field((type) => User)
  @Property({ ref: () => User, required: true })
  user: Ref<User>;

  @Field()
  @Property({ required: true })
  date: Date;
}

@ObjectType()
export class Chat {
  @Field()
  readonly _id: ObjectId;

  @Field((type) => [User])
  @Property({ ref: () => User, required: true })
  users: Ref<User>[];

  @Field((type) => [Message])
  @Property({ default: [], type: () => Message })
  messages: Message[];

  @Field((type) => Group, { nullable: true })
  @Property({ type: () => Group })
  group?: Group;

  @Field((type) => [UserLastSeen])
  @Property({ default: [], type: () => UserLastSeen })
  lastSeen: UserLastSeen[];

  @Field({ nullable: true })
  unreadMessages?: number;
}

export const ChatModel = getModelForClass(Chat, {
  schemaOptions: { timestamps: true },
});
