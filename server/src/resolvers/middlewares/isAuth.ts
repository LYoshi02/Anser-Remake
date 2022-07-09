import { AuthenticationError } from "apollo-server-express";
import { MiddlewareFn } from "type-graphql";

import { Context } from "../../types";

export const IsAuthenticated: MiddlewareFn = ({ context }, next) => {
  const ctx = context as Context;

  if (!ctx.isAuth || !ctx.user) {
    throw new AuthenticationError("User is not authenticated");
  }

  return next();
};
