import express from "express";
import { StatusCodes } from "http-status-codes";
import { boardRouter } from "./boardRouter.js";
import { columnRouter } from "./columnRouter.js";
import { cardRouter } from "./cardRouter.js";
import { authRouter } from "./authRouter.js";

const Router = express.Router();

// Check API v1/status
Router.get("/status", (req, res) => {
  res.status(StatusCodes.OK).json({ message: "API V1 are ready to use" });
});

// Auth APIs
Router.use("/auth", authRouter);

// Board APIs
Router.use("/boards", boardRouter);

Router.use("/columns", columnRouter);

Router.use("/cards", cardRouter);

export const APIs_V1 = Router;
