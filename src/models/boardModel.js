import Joi from "joi";
import {
  OBJECT_ID_RULE,
  MONGO_OBJECT_ID_MESSAGE,
} from "../utils/validators.js";
import { GET_DB } from "../config/mongodb.js";
import { ObjectId } from "mongodb";
import { BOARD_TYPE } from "../utils/constants.js";
import { columnModel } from "./columnModel.js";
import { cardModel } from "./cardModel.js";

const BOARD_COLLECTION_NAME = "boards";
const BOARD_COLLECTION_SCHEMA = Joi.object({
  title: Joi.string().required().min(3).max(50).trim().strict(),
  description: Joi.string().required().min(3).max(256).trim().strict(),
  type: Joi.string().valid(BOARD_TYPE.PUBLIC, BOARD_TYPE.PRIVATE).required(),
  slug: Joi.string().required().min(3).trim().strict(),
  columnOrderIds: Joi.array()
    .items(
      Joi.string().pattern(OBJECT_ID_RULE).message(MONGO_OBJECT_ID_MESSAGE)
    )
    .default([]),
  createdAt: Joi.date().timestamp("javascript").default(Date.now),
  updatedAt: Joi.date().timestamp("javascript").default(null),
  _destroy: Joi.boolean().default(false),
});

const validateBeforeCreate = async (reqBody) => {
  return await BOARD_COLLECTION_SCHEMA.validateAsync(reqBody, {
    abortEarly: false,
  });
};

const createNew = async (reqBody) => {
  try {
    const validateData = await validateBeforeCreate(reqBody);
    return await GET_DB()
      .collection(BOARD_COLLECTION_NAME)
      .insertOne(validateData);
  } catch (error) {
    throw new Error(error);
  }
};

const findOneById = async (id) => {
  try {
    const result = await GET_DB()
      .collection(BOARD_COLLECTION_NAME)
      .findOne({
        _id: new ObjectId(id),
      });
    return result[0] || {};
  } catch (error) {
    throw new Error(error);
  }
};

const getDetail = async (id) => {
  try {
    const result = await GET_DB()
      .collection(BOARD_COLLECTION_NAME)
      .aggregate([
        {
          $match: {
            _id: new ObjectId(id),
            _destroy: false,
          },
        },
        {
          $lookup: {
            from: columnModel.COLUMN_COLLECTION_NAME,
            localField: "_id",
            foreignField: "boardId",
            as: "columns",
          },
        },
        {
          $lookup: {
            from: cardModel.CARD_COLLECTION_NAME,
            localField: "_id",
            foreignField: "boardId",
            as: "cards",
          },
        },
        {
          $addFields: {
            columns: {
              $filter: {
                input: "$columns",
                as: "column",
                cond: { $eq: ["$$column._destroy", false] },
              },
            },
          },
        },
        {
          $addFields: {
            cards: {
              $filter: {
                input: "$cards",
                as: "card",
                cond: { $eq: ["$$card._destroy", false] },
              },
            },
          },
        },
      ])
      .toArray();
    return result[0] || null;
  } catch (error) {
    throw new Error(error);
  }
};

const pushColumnOrderIds = async (column) => {
  try {
    const result = await GET_DB()
      .collection(BOARD_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(column.boardId) },
        { $push: { columnOrderIds: String(column._id) } },
        { returnDocument: "after" }
      );
    return result.value;
  } catch (error) {
    throw new Error(error);
  }
};

const INVALID_UPDATE_FIELDS = ["_id", "createdAt"];

const update = async (boardId, boardData) => {
  try {
    Object.keys(boardData).forEach((key) => {
      if (INVALID_UPDATE_FIELDS.includes(key)) delete boardData[key];
    });
    const result = await GET_DB()
      .collection(BOARD_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(boardId) },
        { $set: boardData },
        { returnDocument: "after" }
      );
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const deleteBoard = async (boardId) => {
  try {
    const result = await GET_DB()
      .collection(BOARD_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(boardId) },
        { $set: { _destroy: true } },
        { returnDocument: "after" }
      );
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const removeColumnFromOrder = async (boardId, columnId) => {
  try {
    return await GET_DB()
      .collection(BOARD_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(boardId) },
        { $pull: { columnOrderIds: String(columnId) } },
        { returnDocument: "after" }
      );
  } catch (error) {
    throw new Error(error);
  }
};

export const boardModel = {
  BOARD_COLLECTION_NAME,
  BOARD_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  getDetail,
  pushColumnOrderIds,
  update,
  deleteBoard,
  removeColumnFromOrder,
};
