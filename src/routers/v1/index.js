import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { boardRouter } from './boardRouter.js';

const Router = express.Router();

// Check API v1/status
Router.get('/status', (req, res) => {
  res.status(StatusCodes.OK).json({ message: 'API V1 are ready to use'});
})

// Board APIs
Router.use('/boards', boardRouter);

export const APIs_V1 = Router;