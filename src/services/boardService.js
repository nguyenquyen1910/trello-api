import { slugify } from '../utils/formatters.js';
import { boardModel } from '../models/boardModel.js';

const createNew = async (boardData) => {
  if (!boardData.title) throw new Error('Title is required');
  const newBoardData = {
    ...boardData,
    slug: slugify(boardData.title),
  };
  const getNewBoard = await boardModel.createNew(newBoardData);

  const newBoard = await boardModel.findOneById(getNewBoard.insertedId);
  return newBoard;
};

export const boardService = {
  createNew,
};
