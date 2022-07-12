import { AuthenticationError } from "apollo-server-express";
import { ObjectId } from "mongodb";
import { MiddlewareFn } from "type-graphql";

import { Context } from "../../types";
import { extractBearerToken, getAccessToken } from "../../utils/auth";

export const IsAuthenticated: MiddlewareFn<Context> = async (
  { context },
  next
) => {
  const ctx = context as Context;

  // Extract Authorization Header
  const authHeader = ctx.req.header("authorization");
  if (!authHeader) {
    throw new AuthenticationError("User is not authenticated");
  }

  // Extract the token from the header
  const token = extractBearerToken(authHeader);
  if (!token) {
    throw new AuthenticationError("User is not authenticated");
  }

  // Validate the token
  let accessToken = getAccessToken(token);
  if (!accessToken) {
    throw new AuthenticationError("User is not authenticated");
  }

  ctx.payload = {
    ...accessToken,
    userId: new ObjectId(accessToken.userId),
  };
  return next();
};
