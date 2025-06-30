import { slugify } from "../utils/formatters.js";
import { userModel } from "../models/userModel.js";
import ApiError from "../utils/ApiError.js";
import { StatusCodes } from "http-status-codes";
import { authUtils } from "../utils/authUtils.js";
import { compare } from "bcryptjs";
import { tokenService } from "./tokenService.js";
import { redis } from "../config/redis.js";
import { sendEmail } from "../utils/sendEmail.js";

const register = async (reqBody) => {
  try {
    const existingEmail = await userModel.findByEmail(reqBody.email);
    if (existingEmail)
      throw new ApiError(StatusCodes.CONFLICT, "Email already exists");
    if (reqBody.password !== reqBody.confirmPassword)
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        "Password and confirm password do not match"
      );
    const { confirmPassword, ...userData } = reqBody;
    const newUserData = {
      ...userData,
      slug: slugify(reqBody.fullname),
    };
    const newUser = await userModel.createNew(newUserData);
    await userModel.updateLastLogin(newUser._id);
    const accessToken = await authUtils.generateAccessToken(newUser);
    const refreshToken = await authUtils.generateRefreshToken(newUser);

    return {
      user: newUser,
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  } catch (error) {
    throw new Error(error);
  }
};

const login = async (email, userPassword) => {
  try {
    const existingUser = await userModel.findByEmail(email);
    if (!existingUser) {
      throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
    }
    const isPasswordCorrect = await compare(
      userPassword,
      existingUser.password
    );
    if (!isPasswordCorrect) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid password");
    }
    if (existingUser.isBanned) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "User is banned");
    }
    const accessToken = await authUtils.generateAccessToken(existingUser);
    const refreshToken = await authUtils.generateRefreshToken(existingUser);
    await userModel.updateLastLogin(existingUser._id);
    const { password, ...userData } = existingUser;
    return {
      user: userData,
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  } catch (error) {
    throw new Error(error);
  }
};

const logout = async (jti) => {
  try {
    await authUtils.logout(jti);

    return {
      message: "Logged out successfully",
    };
  } catch (error) {
    throw new Error(error);
  }
};

const logoutAllSessions = async (userId) => {
  try {
    const sessionCount = await authUtils.logoutAllSessions(userId);

    return {
      message: `Logged out from ${sessionCount} sessions successfully`,
    };
  } catch (error) {
    throw new Error(error);
  }
};

const refreshToken = async (refreshToken) => {
  try {
    const payload = await authUtils.verifyRefreshToken(refreshToken);
    const { jti, id } = payload;
    const isBlacklisted = await tokenService.isTokenBlacklisted(jti);
    if (isBlacklisted) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid refresh token");
    }
    const user = await userModel.findById(id);
    if (!user || user._destroy || user.isBanned) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid refresh token");
    }

    const newAccessToken = await authUtils.generateAccessToken(user);

    return {
      accessToken: newAccessToken,
      refreshToken: refreshToken,
    };
  } catch (error) {
    throw new Error(error);
  }
};

const forgotPassword = async (email) => {
  try {
    const user = await userModel.findByEmail(email);
    if (!user || user._destroy || user.isBanned) {
      throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
    }

    const { otp, expiresIn } = await authUtils.generateOTP();
    await redis.setex(
      `otp:${email}`,
      expiresIn,
      JSON.stringify({ storedOtp: otp, userId: user._id })
    );

    await sendEmail.sendOtpEmail(user.email, otp);
  } catch (error) {
    throw new Error(error);
  }
};

const resetPassword = async (email, otp, newPassword) => {
  try {
    const data = await redis.get(`otp:${email}`);
    if (!data) {
      throw new ApiError(StatusCodes.NOT_FOUND, "OTP expired");
    }
    const { storedOtp, userId } = JSON.parse(data);
    if (String(otp) !== String(storedOtp)) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid OTP");
    }
    const hashed = await userModel.hashPassword(newPassword);
    await userModel.updatePassword(userId, hashed);

    await redis.del(`otp:${email}`);
    await authUtils.logoutAllSessions(userId);
  } catch (error) {
    throw new Error(error);
  }
};

export const authService = {
  register,
  login,
  logout,
  logoutAllSessions,
  refreshToken,
  forgotPassword,
  resetPassword,
};
