import { ObjectId } from "mongoose";
import { getModelForClass, prop as Property } from "@typegoose/typegoose";
import { Field, ObjectType, ID } from "type-graphql";

@ObjectType()
export class User {
  @Field((type) => ID)
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

  @Field({ nullable: true })
  @Property({ default: null, trim: true })
  description?: string;

  @Field()
  @Property()
  password: string;

  @Field()
  @Property({ default: Date.now() })
  createdAt: Date;

  @Field()
  @Property({ default: Date.now() })
  updatedAt: Date;
}

export const UserModel = getModelForClass(User);
