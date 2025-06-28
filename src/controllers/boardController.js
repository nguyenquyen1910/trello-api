import { StatusCodes } from 'http-status-codes';
import ApiError from '../utils/ApiError.js';
import { boardService } from '../services/boardService.js';

const createNew = async (req, res, next) => {
  try {
    const createdBoard = await boardService.createNew(req.body);
    res.status(StatusCodes.CREATED).json({
      message: 'Board created successfully',
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
    res.status(StatusCodes.OK).json(board)
  } catch (error) {
    next(error);
  }
}

export const boardController = {
  createNew,
  getDetail,
};
