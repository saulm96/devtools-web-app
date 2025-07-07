import jwt from "jsonwebtoken";

import { jwtConfig } from "../config/jwt.config";



export const generateAccesToken = (payload: object) => {
  const tokenPayload = {
    ...payload,
    expiresIn: jwtConfig.accessTokenExpiresIn,
  };
  return jwt.sign(tokenPayload, jwtConfig.accesTokenSecret);
};


export const generateRefreshToken = (payload: object) => {
  const tokenPayload = {
    ...payload,
    expiresIn: jwtConfig.refreshTokenExpiresIn,
  };
  return jwt.sign(tokenPayload, jwtConfig.refreshTokenSecret);
};

export const verifyAccesToken = (token: string) => jwt.verify(token, jwtConfig.accesTokenSecret);

export const verifyRefreshToken = (token: string) => jwt.verify(token, jwtConfig.refreshTokenSecret);