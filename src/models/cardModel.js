import Joi from "joi";
import {
  OBJECT_ID_RULE,
  MONGO_OBJECT_ID_MESSAGE,
} from "../utils/validators.js";
import { GET_DB } from "../config/mongodb.js";
import { ObjectId } from "mongodb";

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
  title: Joi.string().required().min(3).max(256).trim().strict(),
  slug: Joi.string().required().min(3).trim().strict(),
  coverUrl: Joi.string().default(null),
  order: Joi.number().integer().min(0),
  createdAt: Joi.date().timestamp("javascript").default(Date.now),
  updatedAt: Joi.date().timestamp("javascript").default(null),
  _destroy: Joi.boolean().default(false),
});

const validateBeforeCreate = async (reqBody) => {
  return await CARD_COLLECTION_SCHEMA.validateAsync(reqBody, {
    abortEarly: false,
  });
};

const createNew = async (reqBody) => {
  try {
    const validateData = await validateBeforeCreate(reqBody);
    const dataToInsert = {
      ...validateData,
      boardId: new ObjectId(validateData.boardId),
      columnId: new ObjectId(validateData.columnId),
    };
    return await GET_DB()
      .collection(CARD_COLLECTION_NAME)
      .insertOne(dataToInsert);
  } catch (error) {
    throw new Error(error);
  }
};

const findOneById = async (id) => {
  try {
    const result = await GET_DB()
      .collection(CARD_COLLECTION_NAME)
      .findOne({
        _id: new ObjectId(id),
        _destroy: false,
      });
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const updateColumn = async (cardId, newColumnId) => {
  try {
    const result = await GET_DB()
      .collection(CARD_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(cardId) },
        { $set: { columnId: new ObjectId(newColumnId) } },
        { returnDocument: "after" }
      );
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const deleteCard = async (cardId) => {
  try {
    const result = await GET_DB()
      .collection(CARD_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(cardId) },
        { $set: { _destroy: true } },
        { returnDocument: "after" }
      );
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

export const cardModel = {
  CARD_COLLECTION_NAME,
  CARD_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  updateColumn,
  deleteCard,
};
