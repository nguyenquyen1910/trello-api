import Joi from 'joi';
import { StatusCodes } from 'http-status-codes';

const createNew = async (req, res, next) => {
    const correctCondition = Joi.object({
        title: Joi.string().required().min(3).max(50).trim().strict().messages({
            'string.empty': 'Title is required',
            'string.min': 'Title must be at least 3 characters long',
            'string.max': 'Title must be at most 50 characters long',
            'string.trim': 'Title must not contain leading or trailing whitespace',
            'string.strict': 'Title must be a string'
        }),
        description: Joi.string().required().min(3).max(256).trim().strict().messages({
            'string.empty': 'Description is required',
        }),
    })

    try {
        console.log('req.body', req.body);
        
        await correctCondition.validateAsync(req.body, { abortEarly: false });

        next();
        res.status(StatusCodes.OK).json({
            message: 'Create a new board'
        })
    } catch (error) {
        res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({
            errors: new Error(error).message
        })
    }
}

export const boardValidation = {
    createNew
}