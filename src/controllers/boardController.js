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
    next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message));
  }
};

export const boardController = {
  createNew,
};
