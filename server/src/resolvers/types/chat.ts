import { ObjectId } from "mongodb";
import { Field, InputType } from "type-graphql";

import { Ref } from "../../types";
import { ObjectIdScalar } from "../../utils/objectId.scalar";
import { User } from "../../schemas/user";
import { Message } from "../../schemas/message";
import { Group } from "../../schemas/group";

@InputType()
export class AddMessageInput {
  @Field()
  text: string;

  @Field({ nullable: true })
  chatId: ObjectId;
}

@InputType()
export class NewChatInput {
  @Field()
  text: string;

  @Field((type) => [ObjectIdScalar])
  recipients: ObjectId[];
}

@InputType()
export class NewGroupInput {
  @Field()
  groupName: string;

  @Field((type) => [ObjectIdScalar])
  groupMembers: ObjectId[];
}

export interface NewMessagePayload {
  chatId: ObjectId;
  message: Message;
  recipients: ObjectId[];
  users?: Ref<User>[];
}

export interface NewChatPayload {
  _id: ObjectId;
  users: Ref<User>[];
  messages: Message[];
  recipients: ObjectId[];
  group?: Group;
}
