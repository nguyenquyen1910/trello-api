import Joi from "joi";
import {
  OBJECT_ID_RULE,
  MONGO_OBJECT_ID_MESSAGE,
} from "../utils/validators.js";

const CARD_COLLECTION_NAME = "cards";
const CARD_COLLECTION_SCHEMA = Joi.object({
  boardId: Joi.string()
    .required()
    .pattern(OBJECT_ID_RULE)
    .message(MONGO_OBJECT_ID_MESSAGE),
  columnId: Joi.string()
    .required()
    .pattern(OBJECT_ID_RULE)
    .message(MONGO_OBJECT_ID_MESSAGE),
  title: Joi.string().required().min(3).max(50).trim().strict(),
  description: Joi.string().optional(),
  coverUrl: Joi.string().default(null),
  order: Joi.number().default(0),

  createdAt: Joi.date().timestamp("javascript").default(Date.now),
  updatedAt: Joi.date().timestamp("javascript").default(null),
  _destroy: Joi.boolean().default(false),
});

export const cardModel = {
  CARD_COLLECTION_NAME,
  CARD_COLLECTION_SCHEMA,
};
