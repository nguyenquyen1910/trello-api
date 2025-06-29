import Joi from "joi";
import {
  OBJECT_ID_RULE,
  MONGO_OBJECT_ID_MESSAGE,
} from "../utils/validators.js";
import { GET_DB } from "../config/mongodb.js";
import { ObjectId } from "mongodb";

const COLUMN_COLLECTION_NAME = "columns";
const COLUMN_COLLECTION_SCHEMA = Joi.object({
  boardId: Joi.string()
    .required()
    .pattern(OBJECT_ID_RULE)
    .message(MONGO_OBJECT_ID_MESSAGE),
  title: Joi.string().required().min(3).max(256).trim().strict(),
  slug: Joi.string().required().min(3).trim().strict(),
  cardOrderIds: Joi.array()
    .items(
      Joi.string().pattern(OBJECT_ID_RULE).message(MONGO_OBJECT_ID_MESSAGE)
    )
    .default([]),
  createdAt: Joi.date().timestamp("javascript").default(Date.now),
  updatedAt: Joi.date().timestamp("javascript").default(null),
  _destroy: Joi.boolean().default(false),
});

const validateBeforeCreate = async (reqBody) => {
  return await COLUMN_COLLECTION_SCHEMA.validateAsync(reqBody, {
    abortEarly: false,
  });
};

const createNew = async (reqBody) => {
  try {
    const validateData = await validateBeforeCreate(reqBody);
    const dataToInsert = {
      ...validateData,
      boardId: new ObjectId(validateData.boardId),
    };
    return await GET_DB()
      .collection(COLUMN_COLLECTION_NAME)
      .insertOne(dataToInsert);
  } catch (error) {
    throw new Error(error);
  }
};

const findOneById = async (id) => {
  try {
    const result = await GET_DB()
      .collection(COLUMN_COLLECTION_NAME)
      .findOne({
        _id: new ObjectId(id),
        _destroy: false,
      });
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const pushCardOrderIds = async (card) => {
  try {
    const result = await GET_DB()
      .collection(COLUMN_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(card.columnId) },
        { $push: { cardOrderIds: new ObjectId(card._id) } },
        { returnDocument: "after" }
      );
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const INVALID_UPDATE_FIELDS = ["_id", "createdAt", "boardId"];
const update = async (columnId, columnData) => {
  try {
    Object.keys(columnData).forEach((key) => {
      if (INVALID_UPDATE_FIELDS.includes(key)) delete columnData[key];
    });

    const result = await GET_DB()
      .collection(COLUMN_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(columnId) },
        { $set: columnData },
        { returnDocument: "after" }
      );
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const removeCardFromOrder = async (columnId, cardId) => {
  try {
    const result = await GET_DB()
      .collection(COLUMN_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(columnId) },
        { $pull: { cardOrderIds: cardId } },
        { returnDocument: "after" }
      );
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const updateCardOrderIds = async (columnId, newOrderIds) => {
  try {
    const result = await GET_DB()
      .collection(COLUMN_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(columnId) },
        { $push: { cardOrderIds: { $each: newOrderIds } } },
        { returnDocument: "after" }
      );
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const reorderCardInColumn = async (columnId, newOrderIds) => {
  try {
    const result = await GET_DB()
      .collection(COLUMN_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(columnId) },
        { $set: { cardOrderIds: newOrderIds } },
        { returnDocument: "after" }
      );
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const deleteColumn = async (columnId) => {
  try {
    const result = await GET_DB()
      .collection(COLUMN_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(columnId) },
        { $set: { _destroy: true } },
        { returnDocument: "after" }
      );
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

export const columnModel = {
  COLUMN_COLLECTION_NAME,
  COLUMN_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  pushCardOrderIds,
  update,
  removeCardFromOrder,
  updateCardOrderIds,
  reorderCardInColumn,
  deleteColumn,
};
