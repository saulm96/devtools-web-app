import { Response } from "express";
import { generateAccesToken, generateRefreshToken } from "./jwt";
import { User } from "../models/User";

export interface UserPayload {
  id: number;
  email: string;
  username: string;
  firstName: string;
}

//For now we save it in memory, later will go in reddis

export const refreshTokenStore = new Map<string, string>();

export const rotateTokens = (
  res: Response,
  user: UserPayload
) => {
  const newAccessToken = generateAccesToken(user);
  const newRefreshToken = generateRefreshToken(user);

  // Update refresh token store
  refreshTokenStore.set(String(user.id), newRefreshToken);

  res.cookie("accessToken", newAccessToken, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 15 * 60 * 1000,
    path: "/",
  });

  res.cookie("refreshToken", newRefreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/",
  });
};

