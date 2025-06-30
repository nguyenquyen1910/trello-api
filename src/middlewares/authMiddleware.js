import { authUtils } from "../utils/authUtils.js";
import { StatusCodes } from "http-status-codes";
import ApiError from "../utils/ApiError.js";
import { userModel } from "../models/userModel.js";

const extractTokenFromHeader = (req) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new ApiError(
      StatusCodes.BAD_REQUEST,
      "Authorization header is required"
    );
  }

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid authorization header");
  }

  return parts[1];
};

const authenticateToken = async (req, res, next) => {
  try {
    const accessToken = extractTokenFromHeader(req);

    if (!accessToken) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Access token is required");
    }

    const decoded = await authUtils.verifyAccessToken(accessToken);
    const user = await userModel.findById(decoded.id);
    if (!user || user._destroy) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid access token");
    }

    if (user.isBanned) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "User is banned");
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized"));
    }
    if (!roles.includes(req.user.role)) {
      return next(new ApiError(StatusCodes.FORBIDDEN, "Forbidden"));
    }
    next();
  };
};

export const authMiddleware = {
  authenticateToken,
  requireRole,
};
