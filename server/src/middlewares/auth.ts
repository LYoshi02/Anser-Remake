import { NextFunction, Response, Request } from "express";
import { verify } from "jsonwebtoken";

import { UserModel } from "../schemas/user";
import { CustomRequest, JwtPayload } from "../types";

/**
 * Custom User Authentication Middleware
 * Which Finds the user from the database using the request token
 */

const AuthMiddleware = async (
  expressReq: Request,
  res: Response,
  next: NextFunction
) => {
  const req = expressReq as CustomRequest;

  // Extract Authorization Header
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    req.isAuth = false;
    return next();
  }

  // Extract the token and check for token
  const token = authHeader.split(" ")[1];
  if (!token || token === "") {
    req.isAuth = false;
    return next();
  }

  // Verify the extracted token
  let decodedToken;
  try {
    decodedToken = verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;
  } catch (err) {
    req.isAuth = false;
    return next();
  }

  // If decoded token is null then set authentication of the request false
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

export default AuthMiddleware;
