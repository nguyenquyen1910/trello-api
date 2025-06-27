import { StatusCodes } from 'http-status-codes';

const createNew = async (req, res) => {
    try {
        res.status(StatusCodes.OK).json({
            message: 'Create a new board from controller'
        })
    } catch (error) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
            errors: error.message
        })
    }
}

export const boardController = {
    createNew
}