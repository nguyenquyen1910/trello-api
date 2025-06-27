import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { boardValidation } from '../../validations/boardValidation.js';
import { boardController } from '../../controllers/boardController.js';

const Router = express.Router();

Router.route('/')
    .get((req, res) => {
        res.status(StatusCodes.OK).json({
            message: 'Get all boards'
        })
    })
    .post(boardValidation.createNew, boardController.createNew)

export const boardRouter = Router; 