import jwt from "jsonwebtoken";
import { env } from "../config/environment.js";
import ApiError from "./ApiError.js";
import { StatusCodes } from "http-status-codes";
import { tokenService } from "../services/tokenService.js";

const generateAccessToken = async (user) => {
  const jti = tokenService.generateTokenId();
  const token = jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
      jti: jti,
    },
    env.JWT_ACCESS_TOKEN_SECRET,
    {
      expiresIn: env.JWT_ACCESS_TOKEN_EXPIRES_IN,
      algorithm: "HS256",
    }
  );
  await tokenService.storeToken(jti, user._id, env.JWT_ACCESS_TOKEN_EXPIRES_IN);
  return token;
};

const generateRefreshToken = async (user) => {
  const jti = tokenService.generateTokenId();
  const token = jwt.sign(
    {
      id: user._id,
      email: user.email,
      role: user.role,
      jti: jti,
    },
    env.JWT_REFRESH_TOKEN_SECRET,
    {
      expiresIn: env.JWT_REFRESH_TOKEN_EXPIRES_IN,
      algorithm: "HS256",
    }
  );
  await tokenService.storeToken(
    jti,
    user._id,
    env.JWT_REFRESH_TOKEN_EXPIRES_IN
  );
  return token;
};

const verifyAccessToken = async (accessToken) => {
  try {
    const decoded = jwt.verify(accessToken, env.JWT_ACCESS_TOKEN_SECRET);
    const isBlacklisted = await tokenService.isTokenBlacklisted(decoded.jti);
    if (isBlacklisted) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Token is blacklisted");
    }
    return decoded;
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Access token expired");
    }
    if (error.name === "JsonWebTokenError") {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid access token");
    }
    throw error;
  }
};

const verifyRefreshToken = async (refreshToken) => {
  try {
    const decoded = jwt.verify(refreshToken, env.JWT_REFRESH_TOKEN_SECRET);
    const isBlacklisted = await tokenService.isTokenBlacklisted(decoded.jti);
    if (isBlacklisted) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Token is blacklisted");
    }
    return decoded;
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Refresh token expired");
    }
    if (error.name === "JsonWebTokenError") {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid refresh token");
    }
    throw error;
  }
};

const logout = async (jti) => {
  await tokenService.blacklistToken(jti);
};

const logoutAllSessions = async (userId) => {
  return await tokenService.logoutAllSessions(userId);
};

const generateOTP = async () => {
  const otp = Math.floor(100000 + Math.random() * 900000);
  const expiresIn = 5 * 60;
  return { otp, expiresIn };
};

export const authUtils = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  logout,
  logoutAllSessions,
  generateOTP,
};
