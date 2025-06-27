import { StatusCodes } from 'http-status-codes';
import ApiError from '../utils/ApiError.js';

const createNew = async (req, res, next) => {
    try {
        const { title, description } = req.body;
        res.status(StatusCodes.CREATED).json({
            message: 'Create a new board from controller'
        })
    } catch (error) {
        next(new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, error.message));
    }
}

export const boardController = {
    createNew
} 