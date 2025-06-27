import Joi from 'joi';
import {
  OBJECT_ID_RULE,
  MONGO_OBJECT_ID_MESSAGE,
} from '../utils/validators.js';
import { GET_DB } from '../config/mongodb.js';
import { ObjectId } from 'mongodb';

const BOARD_COLLECTION_NAME = 'boards';
const BOARD_COLLECTION_SCHEMA = Joi.object({
  title: Joi.string().required().min(3).max(50).trim().strict(),
  description: Joi.string().required().min(3).max(256).trim().strict(),
  slug: Joi.string().required().min(3).trim().strict(),
  columnOrderIds: Joi.array()
    .items(
      Joi.string().pattern(OBJECT_ID_RULE).message(MONGO_OBJECT_ID_MESSAGE)
    )
    .default([]),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false),
});


const validateBeforeCreate = async (reqBody) => {
    return await BOARD_COLLECTION_SCHEMA.validateAsync(reqBody, {abortEarly: false});
}

const createNew = async (reqBody) => {
  try {
    const validateData = await validateBeforeCreate(reqBody);
    return await GET_DB().collection(BOARD_COLLECTION_NAME).insertOne(validateData);
  } catch (error) {
    throw new Error(error);
  }
};

const findOneById = async (id) => {
  try {
    const result = await GET_DB().collection(BOARD_COLLECTION_NAME).findOne({
      _id: new ObjectId(id),
    });
    return result;
  } catch (error) {
    throw new Error(error);
  }
};


export const boardModel = {
  BOARD_COLLECTION_NAME,
  BOARD_COLLECTION_SCHEMA,
  createNew,
  findOneById,
};
