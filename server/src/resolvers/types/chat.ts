import { ObjectId } from "mongodb";
import { Field, InputType } from "type-graphql";

import { Ref } from "../../types";
import { ObjectIdScalar } from "../../utils/objectId.scalar";
import { User } from "../../schemas/user";
import { Message } from "../../schemas/message";

@InputType()
export class AddMessageInput {
  @Field()
  text: string;

  @Field((type) => [ObjectIdScalar])
  recipients: ObjectId[];

  @Field({ nullable: true })
  chatId?: ObjectId;
}

export interface NewMessagePayload {
  chatId: ObjectId;
  message: Message;
  recipients: ObjectId[];
}

export interface NewChatPayload {
  _id: ObjectId;
  users: Ref<User>[];
  messages: Message[];
  recipients: ObjectId[];
}
