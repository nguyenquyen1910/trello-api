import { StatusCodes } from "http-status-codes";
import { authService } from "../services/authService.js";

const register = async (req, res, next) => {
  try {
    const createdUser = await authService.register(req.body);
    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "User created successfully",
      data: {
        user: createdUser.user,
        accessToken: createdUser.accessToken,
        refreshToken: createdUser.refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const authController = {
  register,
};
