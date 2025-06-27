import { slugify } from '../utils/formatters.js';

const createNew = async (boardData) => {
    if(!boardData.title) throw new Error('Title is required');
    const newBoard = {
        ...boardData,
        slug: slugify(boardData.title)
    }
    return newBoard;
}

export const boardService = {
    createNew
}