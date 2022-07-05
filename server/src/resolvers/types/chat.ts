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

  @Field()
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

@InputType()
export class AddUsersToGroupInput {
  @Field()
  chatId: ObjectId;

  @Field((type) => [ObjectIdScalar])
  newUsers: ObjectId[];
}

@InputType()
export class GroupOperationInput {
  @Field()
  chatId: ObjectId;

  @Field()
  userId: ObjectId;
}

@InputType()
export class ChangeGroupNameArgs {
  @Field()
  chatId: ObjectId;

  @Field()
  newName: string;
}

export interface NewMessagePayload {
  chatId: ObjectId;
  message: Message;
  users?: Ref<User>[];
  group?: Group;
}
