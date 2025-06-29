import { slugify } from "../utils/formatters.js";
import { userModel } from "../models/userModel.js";
import ApiError from "../utils/ApiError.js";
import { StatusCodes } from "http-status-codes";
import { authUtils } from "../utils/authUtils.js";

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

export const authService = {
  register,
};
