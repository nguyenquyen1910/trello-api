import Joi from "joi";
import { StatusCodes } from "http-status-codes";
import ApiError from "../utils/ApiError.js";
import { BOARD_TYPE } from "../utils/constants.js";

const createNew = async (req, res, next) => {
  const correctCondition = Joi.object({
    title: Joi.string().required().min(3).max(50).trim().strict().messages({
      "string.empty": "Title is required",
      "string.min": "Title must be at least 3 characters long",
      "string.max": "Title must be at most 50 characters long",
      "string.trim": "Title must not contain leading or trailing whitespace",
      "string.strict": "Title must be a string",
    }),
    description: Joi.string()
      .required()
      .min(3)
      .max(256)
      .trim()
      .strict()
      .messages({
        "string.empty": "Description is required",
        "string.min": "Description must be at least 3 characters long",
        "string.max": "Description must be at most 256 characters long",
        "string.trim":
          "Description must not contain leading or trailing whitespace",
        "string.strict": "Description must be a string",
      }),
    type: Joi.string().valid(BOARD_TYPE.PUBLIC, BOARD_TYPE.PRIVATE).required(),
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

const update = async (req, res, next) => {
  const correctCondition = Joi.object({
    title: Joi.string().min(3).max(50).trim().strict().messages({
      "string.min": "Title must be at least 3 characters long",
      "string.max": "Title must be at most 50 characters long",
      "string.trim": "Title must not contain leading or trailing whitespace",
      "string.strict": "Title must be a string",
    }),
    description: Joi.string().min(3).max(256).trim().strict().messages({
      "string.min": "Description must be at least 3 characters long",
      "string.max": "Description must be at most 256 characters long",
      "string.trim":
        "Description must not contain leading or trailing whitespace",
      "string.strict": "Description must be a string",
    }),
    type: Joi.string().valid(BOARD_TYPE.PUBLIC, BOARD_TYPE.PRIVATE),
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

export const boardValidation = {
  createNew,
  update,
};
