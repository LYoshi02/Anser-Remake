import { Request, Response } from "express";
import { ObjectId } from "mongodb";

export type Context = {
  req: Request;
  res: Response;
  payload?: JwtPayload;
};

export type JwtPayload = {
  userId: ObjectId;
  username: string;
};

export type Ref<T> = T | ObjectId;
