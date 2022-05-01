import { ObjectId } from "mongodb";
import { getModelForClass, prop as Property } from "@typegoose/typegoose";
import { Field, ObjectType } from "type-graphql";

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
  @Property({ default: "", trim: true })
  description: string;

  @Field()
  @Property()
  password: string;
}

@ObjectType()
export class LoggedInUser {
  @Field((type) => User)
  user: User;

  @Field()
  token: string;
}

@ObjectType()
export class UserWithoutPassword {
  @Field()
  readonly _id: ObjectId;

  @Field()
  email: string;

  @Field()
  username: string;

  @Field()
  fullname: string;

  @Field()
  description: string;
}

@ObjectType()
export class AuthUser {
  @Field()
  isAuth: boolean;

  @Field((type) => User, { nullable: true })
  user?: User;
}

@ObjectType()
export class NewUser {
  @Field()
  readonly _id: ObjectId;

  @Field()
  username: string;

  @Field()
  fullname: string;
}

export const UserModel = getModelForClass(User, {
  schemaOptions: { timestamps: true },
});
