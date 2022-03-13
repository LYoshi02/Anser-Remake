import { ObjectId } from "mongodb";
import { Field, InputType } from "type-graphql";

import { ObjectIdScalar } from "../../utils/objectId.scalar";

@InputType()
export class AddMessageInput {
  @Field()
  text: string;

  @Field((type) => [ObjectIdScalar])
  recipients: ObjectId[];

  @Field({ nullable: true })
  chatId?: ObjectId;
}
