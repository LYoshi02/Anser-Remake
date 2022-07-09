import { NextFunction, Response, Request } from "express";

import { UserModel } from "../schemas/user";
import { CustomRequest } from "../types";
import { getDecodedToken, extractBearerToken } from "../utils/auth";

/**
 * Custom User Authentication Middleware
 * Which Finds the user from the database using the request token
 */
export const AuthMiddleware = async (
  expressReq: Request,
  res: Response,
  next: NextFunction
) => {
  const req = expressReq as CustomRequest;

  // Extract Authorization Header
  const authHeader = req.header("authorization");
  if (!authHeader) {
    req.isAuth = false;
    return next();
  }

  // Extract the token and check for token
  const token = extractBearerToken(authHeader);
  if (!token) {
    req.isAuth = false;
    return next();
  }

  // If decoded token is null then set authentication of the request false
  let decodedToken = getDecodedToken(token);
  if (!decodedToken) {
    req.isAuth = false;
    return next();
  }

  // If the user has valid token then Find the user by decoded token's id
  let authUser = await UserModel.findById(decodedToken._id);
  if (!authUser) {
    req.isAuth = false;
    return next();
  }

  req.isAuth = true;
  req.user = authUser;
  return next();
};
