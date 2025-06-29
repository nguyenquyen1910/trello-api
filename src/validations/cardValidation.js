import Joi from "joi";
import { StatusCodes } from "http-status-codes";
import ApiError from "../utils/ApiError.js";
import {
  OBJECT_ID_RULE,
  MONGO_OBJECT_ID_MESSAGE,
} from "../utils/validators.js";

const createNew = async (req, res, next) => {
  const correctCondition = Joi.object({
    title: Joi.string().required().min(3).max(256).trim().strict().messages({
      "string.empty": "Title is required",
      "string.min": "Title must be at least 3 characters long",
      "string.max": "Title must be at most 256 characters long",
      "string.trim": "Title must not contain leading or trailing whitespace",
      "string.strict": "Title must be a string",
    }),
    boardId: Joi.string()
      .required()
      .pattern(OBJECT_ID_RULE)
      .message(MONGO_OBJECT_ID_MESSAGE),
    columnId: Joi.string()
      .required()
      .pattern(OBJECT_ID_RULE)
      .message(MONGO_OBJECT_ID_MESSAGE),
    coverUrl: Joi.string().default(null),
    order: Joi.number().integer().min(0),
  });

  try {
    await correctCondition.validateAsync(req.body, { abortEarly: false });
    next();
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, error.message));
  }
};

const moveCard = async (req, res, next) => {
  const correctCondition = Joi.object({
    sourceColumnId: Joi.string()
      .pattern(OBJECT_ID_RULE)
      .message(MONGO_OBJECT_ID_MESSAGE),
    destinationColumnId: Joi.string()
      .pattern(OBJECT_ID_RULE)
      .message(MONGO_OBJECT_ID_MESSAGE),
    destinationOrderIds: Joi.array()
      .items(
        Joi.string().pattern(OBJECT_ID_RULE).message(MONGO_OBJECT_ID_MESSAGE)
      )
      .min(0),
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

export const cardValidation = {
  createNew,
  moveCard,
};
