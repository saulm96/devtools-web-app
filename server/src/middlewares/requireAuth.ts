import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { verifyAccesToken, verifyRefreshToken } from "../utils/jwt";
import {
  rotateTokens,
  refreshTokenStore,
  UserPayload,
} from "../utils/authUtils";

export interface CustomRequest extends Request {
  user: UserPayload;
}
export const requireAuth = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const accessToken = req.cookies.accessToken;
  const refreshToken = req.cookies.refreshToken;

  if (!accessToken && !refreshToken) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = verifyAccesToken(accessToken) as UserPayload;
    req.user = decoded;
    return next();
  } catch (err: any) {
    // Access Token expired
    if (err.name === "TokenExpiredError" && refreshToken) {
      try {
        const decodedRefresh = verifyRefreshToken(refreshToken) as UserPayload;

        // Validate refresh token 
        const storedToken = refreshTokenStore.get(String(decodedRefresh.id));
        if (storedToken !== refreshToken) {
          return res.status(403).json({ message: "Invalid refresh token" });
        }

        // Rotate tokens
        rotateTokens(res, decodedRefresh);
        req.user = decodedRefresh;
        return next();
      } catch (refreshError) {
        return res
          .status(403)
          .json({ message: "Refresh token invalid or expired" });
      }
    }

    return res.status(401).json({ message: "Unauthorized" });
  }
};
