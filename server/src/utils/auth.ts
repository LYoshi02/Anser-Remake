import { sign, verify } from "jsonwebtoken";

import { UserModel } from "../schemas/user";
import { JwtPayload } from "../types";

export const issueAuthToken = (jwtPayload: JwtPayload) => {
  let token = sign(jwtPayload, process.env.JWT_SECRET as string, {
    expiresIn: 3600 * 24,
  });

  return `Bearer ${token}`;
};

export const extractBearerToken = (bearerToken: string) => {
  const extractedToken = bearerToken.split(" ")[1];

  if (!extractedToken || extractedToken === "") return null;

  return extractedToken;
};

export const getDecodedToken: (t: string) => JwtPayload | null = (
  token: string
) => {
  let decodedToken;

  try {
    decodedToken = verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;
  } catch (error) {
    decodedToken = null;
  }

  return decodedToken;
};

// TODO: check this function
// The token looks like "Bearer <user_token>"
export const getUserIdWithToken = async (userToken: any) => {
  if (!userToken || typeof userToken !== "string") return null;

  const extractedToken = extractBearerToken(userToken);
  if (!extractedToken) return null;

  let decodedToken = getDecodedToken(extractedToken);
  if (!decodedToken) return null;

  let authUser = await UserModel.findById(decodedToken._id, { _id: 1 });
  if (!authUser) return null;

  return authUser._id;
};
