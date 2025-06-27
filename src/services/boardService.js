import { slugify } from '../utils/formatters.js';
import { boardModel } from '../models/boardModel.js';

const createNew = async (boardData) => {
    if(!boardData.title) throw new Error('Title is required');
    const newBoard = {
        ...boardData,
        slug: slugify(boardData.title)
    }

    const getNewBoard = await boardModel.findOneById(newBoard.insertedId);

    return getNewBoard;
}

export const boardService = {
    createNew,
} 