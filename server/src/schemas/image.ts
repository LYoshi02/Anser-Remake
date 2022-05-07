import { ObjectId } from "mongodb";
import { prop as Property } from "@typegoose/typegoose";
import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class Image {
  @Field()
  readonly _id: ObjectId;

  @Field()
  @Property({ required: true })
  publicId: string;

  @Field()
  @Property({ required: true })
  url: string;
}
