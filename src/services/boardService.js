import { slugify } from "../utils/formatters.js";
import { boardModel } from "../models/boardModel.js";
import ApiError from "../utils/ApiError.js";
import { StatusCodes } from "http-status-codes";
import _ from "lodash";

const createNew = async (boardData) => {
  if (!boardData.title) throw new Error("Title is required");
  const newBoardData = {
    ...boardData,
    slug: slugify(boardData.title),
  };
  const getNewBoard = await boardModel.createNew(newBoardData);

  const newBoard = await boardModel.findOneById(getNewBoard.insertedId);
  return newBoard;
};

const getDetail = async (boardId) => {
  try {
    const board = await boardModel.getDetail(boardId);
    if (!board) throw new ApiError(StatusCodes.NOT_FOUND, "Board not found");

    const resBoard = _.cloneDeep(board);
    resBoard.columns.forEach((column) => {
      column.cards = resBoard.cards.filter((card) =>
        card.columnId.equals(column._id)
      );
    });

    delete resBoard.cards;

    return resBoard;
  } catch (error) {
    throw new Error(error);
  }
};

export const boardService = {
  createNew,
  getDetail,
};
