import { sign } from "jsonwebtoken";

import { JwtPayload } from "../types";

export const issueAuthToken = (jwtPayload: JwtPayload) => {
  let token = sign(jwtPayload, process.env.JWT_SECRET as string, {
    expiresIn: 3600 * 24,
  });

  return `Bearer ${token}`;
};
