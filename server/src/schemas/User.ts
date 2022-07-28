import { ObjectId } from "mongodb";
import { getModelForClass, prop as Property } from "@typegoose/typegoose";
import { Field, ObjectType } from "type-graphql";

import { Image } from "./image";

@ObjectType()
export class User {
  @Field()
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

  @Field()
  @Property({ default: "", trim: true, maxLength: 160 })
  description: string;

  @Property({ minLength: 8 })
  password: string;

  @Field((type) => Image, { nullable: true })
  @Property()
  profileImg?: Image;

  @Field({ nullable: true })
  isNewUser?: boolean;
}

export const UserModel = getModelForClass(User, {
  schemaOptions: { timestamps: true },
});
