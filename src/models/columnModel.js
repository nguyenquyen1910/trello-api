import Joi from 'joi';
import { OBJECT_ID_RULE, MONGO_OBJECT_ID_MESSAGE } from '../utils/validation.js';

const COLUMN_COLLECTION_NAME = 'columns';
const COLUMN_COLLECTION_SCHEMA = Joi.object({
  boardId: Joi.string().required().pattern(OBJECT_ID_RULE).message(MONGO_OBJECT_ID_MESSAGE),
  title: Joi.string().required().min(3).max(50).trim().strict(),
  cardOrderIds: Joi.array().items(
    Joi.string().pattern(OBJECT_ID_RULE).message(MONGO_OBJECT_ID_MESSAGE)
  ).default([]),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false),
});

export const columnModel = {
  COLUMN_COLLECTION_NAME, 
  COLUMN_COLLECTION_SCHEMA,
};