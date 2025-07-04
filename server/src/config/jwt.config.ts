import dotenv from "dotenv";

dotenv.config();

export const jwtConfig = {
    accesTokenSecret: process.env.JWT_ACCESS_TOKEN_SECRET || 'acces_default_key',
    refreshTokenSecret: process.env.JWT_REFRESH_TOKEN_SECRET || 'refresh_default_key',
    accessTokenExpiresIn: '15m',
    refreshTokenExpiresIn: '7d'
}

