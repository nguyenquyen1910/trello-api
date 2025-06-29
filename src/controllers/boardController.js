import { StatusCodes } from "http-status-codes";
import { boardService } from "../services/boardService.js";

const createNew = async (req, res, next) => {
  try {
    const createdBoard = await boardService.createNew(req.body);
    res.status(StatusCodes.CREATED).json({
      message: "Board created successfully",
      data: {
        board: createdBoard,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getDetail = async (req, res, next) => {
  try {
    const boardId = req.params.id;
    const board = await boardService.getDetail(boardId);
    res.status(StatusCodes.OK).json(board);
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const boardId = req.params.id;
    const updateBoard = await boardService.update(boardId, req.body);
    res.status(StatusCodes.OK).json({
      message: "Board updated successfully",
      data: {
        board: updateBoard,
      },
    });
  } catch (error) {
    next(error);
  }
};

const deleteBoard = async (req, res, next) => {
  try {
    const boardId = req.params.id;
    const deletedBoard = await boardService.deleteBoard(boardId);
    res.status(StatusCodes.OK).json({
      message: "Board deleted successfully",
      data: {
        board: deletedBoard,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const boardController = {
  createNew,
  getDetail,
  update,
  deleteBoard,
};
