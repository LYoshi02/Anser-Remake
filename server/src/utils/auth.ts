import { Response } from "express";
import { sign, verify } from "jsonwebtoken";

import { JwtPayload } from "../types";

export const createAccessToken = (jwtPayload: JwtPayload) => {
  return sign(jwtPayload, process.env.ACCESS_TOKEN_SECRET as string, {
    expiresIn: "15m",
  });
};

export const createRefreshToken = (jwtPayload: JwtPayload) => {
  return sign(jwtPayload, process.env.REFRESH_TOKEN_SECRET as string, {
    expiresIn: "7d",
  });
};

export const sendRefreshToken = (res: Response, token: string) => {
  res.cookie("jid", token, {
    httpOnly: true,
    path: "/refresh-token",
    sameSite: "none",
    secure: true,
  });
};

export const extractBearerToken = (bearerToken: string) => {
  const extractedToken = bearerToken.split(" ")[1];

  if (!extractedToken || extractedToken === "") return null;

  return extractedToken;
};

export const getAccessToken: (t: string) => JwtPayload | null = (
  token: string
) => {
  const accessToken = getDecodedToken(
    token,
    process.env.ACCESS_TOKEN_SECRET as string
  );
  return accessToken;
};

export const getRefreshToken: (t: string) => JwtPayload | null = (
  token: string
) => {
  const refreshToken = getDecodedToken(
    token,
    process.env.REFRESH_TOKEN_SECRET as string
  );
  return refreshToken;
};

const getDecodedToken: (t: string, s: string) => JwtPayload | null = (
  token,
  secret
) => {
  let decodedToken;

  try {
    decodedToken = verify(token, secret) as JwtPayload;
  } catch (error) {
    decodedToken = null;
  }

  return decodedToken;
};

// TODO: check this function
// The token looks like "Bearer <user_token>"
export const getUserIdWithToken = (userToken: any) => {
  if (!userToken || typeof userToken !== "string") return null;

  const extractedToken = extractBearerToken(userToken);
  if (!extractedToken) return null;

  let accessToken = getAccessToken(extractedToken);
  if (!accessToken) return null;

  return accessToken.userId;
};
