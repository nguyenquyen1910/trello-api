import Joi from "joi";
import { GET_DB } from "../config/mongodb.js";
import { USER_ROLE } from "../utils/constants.js";
import { hash } from "bcryptjs";
import { ObjectId } from "mongodb";

const USER_COLLECTION_NAME = "users";
const USER_COLLECTION_SCHEMA = Joi.object({
  email: Joi.string().email().required().trim().strict(),
  fullname: Joi.string().required().min(3).max(50).trim().strict(),
  slug: Joi.string().required().trim().strict(),
  password: Joi.string()
    .regex(/[0-9a-zA-Z]*\d[0-9a-zA-Z]*/)
    .regex(/[0-9a-zA-Z]*[a-zA-Z][0-9a-zA-Z]*/)
    .min(6)
    .required(),
  avatar: Joi.string().default(null),
  jobTitle: Joi.string().default(null),
  department: Joi.string().default(null),
  organization: Joi.string().default(null),
  role: Joi.string()
    .valid(USER_ROLE.ADMIN, USER_ROLE.MEMBER, USER_ROLE.GUEST)
    .default(USER_ROLE.MEMBER),
  isActive: Joi.boolean().default(true),
  isBanned: Joi.boolean().default(false),
  lastLogin: Joi.date().timestamp("javascript").default(null),
  createdAt: Joi.date().timestamp("javascript").default(Date.now),
  updatedAt: Joi.date().timestamp("javascript").default(null),
  _destroy: Joi.boolean().default(false),
});

const hashPassword = async (password) => {
  const saltRounds = 12;
  return await hash(password, saltRounds);
};
const validateBeforeCreate = async (reqBody) => {
  return await USER_COLLECTION_SCHEMA.validateAsync(reqBody, {
    abortEarly: false,
  });
};

const findByEmail = async (email) => {
  try {
    const result = await GET_DB().collection(USER_COLLECTION_NAME).findOne({
      email: email,
      _destroy: false,
    });
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const findById = async (id) => {
  try {
    const result = await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .findOne({
        _id: new ObjectId(id),
        _destroy: false,
      });
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const createNew = async (newUserData) => {
  try {
    const validateData = await validateBeforeCreate(newUserData);
    const hashedPassword = await hashPassword(validateData.password);
    const result = await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .insertOne({
        ...validateData,
        password: hashedPassword,
      });
    return await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .findOne({ _id: result.insertedId });
  } catch (error) {
    throw new Error(error);
  }
};

const updateLastLogin = async (userId) => {
  try {
    const result = await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(userId) },
        {
          $set: {
            lastLogin: Date.now(),
            updatedAt: Date.now(),
          },
        },
        { returnDocument: "after" }
      );
    return result.value;
  } catch (error) {
    throw new Error(error);
  }
};

const updatePassword = async (userId, newPassword) => {
  try {
    const result = await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .findOneAndUpdate(
        { _id: new ObjectId(userId) },
        { $set: { password: newPassword } },
        { returnDocument: "after" }
      );
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

export const userModel = {
  createNew,
  findByEmail,
  findById,
  hashPassword,
  validateBeforeCreate,
  updateLastLogin,
  updatePassword,
};
