import { Request } from "express";
import { ObjectId } from "mongodb";

import { User } from "../schemas/user";

export interface CustomRequest extends Request {
  user?: User;
  isAuth: boolean;
}

export type Context = {
  user?: User;
  isAuth: boolean;
};

export type JwtPayload = {
  _id: ObjectId;
};

export type Ref<T> = T | ObjectId;
