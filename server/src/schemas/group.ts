import { prop as Property } from "@typegoose/typegoose";
import { Field, ObjectType } from "type-graphql";

import { Ref } from "../types";
import { User } from "./user";
import { Image } from "./image";

@ObjectType()
export class Group {
  @Field((type) => [User])
  @Property({ ref: User, required: true })
  admins: Ref<User>[];

  @Field()
  @Property({ required: true, minLength: 3, trim: true })
  name: string;

  @Field((type) => Image, { nullable: true })
  @Property()
  image?: Image;
}
