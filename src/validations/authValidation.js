import Joi from "joi";
import { StatusCodes } from "http-status-codes";
import ApiError from "../utils/ApiError.js";

const register = async (req, res, next) => {
  const correctCondition = Joi.object({
    fullname: Joi.string().required().min(3).max(50).trim().strict().messages({
      "string.empty": "Fullname is required",
      "string.min": "Fullname must be at least 3 characters long",
      "string.max": "Fullname must be at most 50 characters long",
      "string.trim": "Fullname must not contain leading or trailing whitespace",
      "string.strict": "Fullname must be a string",
    }),
    email: Joi.string().email().required().trim().strict().messages({
      "string.empty": "Email is required",
      "string.email": "Email must be a valid email address",
      "string.trim": "Email must not contain leading or trailing whitespace",
      "string.strict": "Email must be a string",
    }),
    password: Joi.string()
      .required()
      .min(6)
      .pattern(/^(?=.*[a-zA-Z])(?=.*\d)/)
      .trim()
      .strict()
      .messages({
        "string.empty": "Password is required",
        "string.min": "Password must be at least 6 characters long",
        "string.pattern.base":
          "Password must contain at least one letter and one number",
        "string.trim":
          "Password must not contain leading or trailing whitespace",
        "string.strict": "Password must be a string",
      }),
  });
  try {
    await correctCondition.validateAsync(req.body, {
      abortEarly: false,
      allowUnknown: true,
    });
    next();
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message));
  }
};

const login = async (req, res, next) => {
  const correctCondition = Joi.object({
    email: Joi.string().email().required().trim().strict().messages({
      "string.empty": "Email is required",
      "string.email": "Email must be a valid email address",
      "string.trim": "Email must not contain leading or trailing whitespace",
      "string.strict": "Email must be a string",
    }),
    password: Joi.string()
      .required()
      .min(6)
      .pattern(/^(?=.*[a-zA-Z])(?=.*\d)/)
      .trim()
      .strict()
      .messages({
        "string.empty": "Password is required",
        "string.min": "Password must be at least 6 characters long",
        "string.pattern.base":
          "Password must contain at least one letter and one number",
        "string.trim":
          "Password must not contain leading or trailing whitespace",
        "string.strict": "Password must be a string",
      }),
  });
  try {
    await correctCondition.validateAsync(req.body, {
      abortEarly: false,
    });
    next();
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message));
  }
};

const resetPassword = async (req, res, next) => {
  const correctCondition = Joi.object({
    email: Joi.string().email().required().trim().strict().messages({
      "string.empty": "Email is required",
      "string.email": "Email must be a valid email address",
      "string.trim": "Email must not contain leading or trailing whitespace",
      "string.strict": "Email must be a string",
    }),
    otp: Joi.string()
      .length(6)
      .pattern(/^[0-9]+$/)
      .required(),
    newPassword: Joi.string()
      .required()
      .min(6)
      .pattern(/^(?=.*[a-zA-Z])(?=.*\d)/)
      .trim()
      .strict()
      .messages({
        "string.empty": "Password is required",
        "string.min": "Password must be at least 6 characters long",
        "string.pattern.base":
          "Password must contain at least one letter and one number",
        "string.trim":
          "Password must not contain leading or trailing whitespace",
        "string.strict": "Password must be a string",
      }),
  });
  try {
    await correctCondition.validateAsync(req.body, {
      abortEarly: false,
    });
    next();
  } catch (error) {
    throw new Error(error);
  }
};

export const authValidation = {
  register,
  login,
  resetPassword,
};
