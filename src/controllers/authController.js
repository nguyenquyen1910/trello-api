import { StatusCodes } from "http-status-codes";
import { authService } from "../services/authService.js";
import jwt from "jsonwebtoken";

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

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const loginUser = await authService.login(email, password);
    res.status(StatusCodes.OK).json({
      success: true,
      message: "User logged in successfully",
      data: {
        user: loginUser.user,
        accessToken: loginUser.accessToken,
        refreshToken: loginUser.refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (token) {
      const decoded = jwt.decode(token);
      const jti = decoded.jti;

      await authService.logout(jti);
    }
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    next(error);
  }
};

const logoutAllSessions = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const result = await authService.logoutAllSessions(userId);

    res.status(StatusCodes.OK).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    const tokens = await authService.refreshToken(refreshToken);
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Token refreshed successfully",
      data: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    await authService.forgotPassword(email);
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Password reset email sent successfully",
    });
  } catch (error) {
    next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;
    await authService.resetPassword(email, otp, newPassword);
    res.status(StatusCodes.OK).json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const authController = {
  register,
  login,
  logout,
  logoutAllSessions,
  refreshToken,
  forgotPassword,
  resetPassword,
};
