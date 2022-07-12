import { ObjectId } from "mongodb";
import { Field, InputType, ObjectType } from "type-graphql";

import { Ref } from "../../types";
import { ObjectIdScalar } from "../../utils/objectId.scalar";
import { User } from "../../schemas/user";
import { Message } from "../../schemas/message";
import { Group } from "../../schemas/group";
import { ArrayNotEmpty, IsNotEmpty, MinLength } from "class-validator";

@InputType()
export class AddMessageInput {
  @Field()
  @IsNotEmpty({ message: "Invalid message" })
  text: string;

  @Field()
  chatId: ObjectId;
}

@InputType()
export class NewChatInput {
  @Field()
  @IsNotEmpty({ message: "Invalid message" })
  text: string;

  @Field((type) => [ObjectIdScalar])
  @ArrayNotEmpty({ message: "The recipients array can't be empty" })
  recipients: ObjectId[];
}

@InputType()
export class NewGroupInput {
  @Field()
  @MinLength(3, { message: "The name must be at least 3 characters long" })
  groupName: string;

  @Field((type) => [ObjectIdScalar])
  @ArrayNotEmpty({ message: "The groupUsers array can't be empty" })
  groupUsers: ObjectId[];
}

@InputType()
export class AddUsersToGroupInput {
  @Field()
  chatId: ObjectId;

  @Field((type) => [ObjectIdScalar])
  @ArrayNotEmpty({ message: "The newUsers array can't be empty" })
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
  @MinLength(3, { message: "The name must be at least 3 characters long" })
  newName: string;
}

@ObjectType()
export class NewMessage {
  @Field()
  readonly chatId: ObjectId;

  @Field((type) => Message)
  @IsNotEmpty({ message: "Invalid message" })
  message: Message;

  @Field((type) => [User], { nullable: true })
  users?: Ref<User>[];

  @Field((type) => Group, { nullable: true })
  group?: Group;
}

export interface NewMessagePayload {
  chatId: ObjectId;
  message: Message;
  users?: Ref<User>[];
  group?: Group;
}
