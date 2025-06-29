import express from "express";
import { authController } from "../../controllers/authController.js";
import { authValidation } from "../../validations/authValidation.js";

const Router = express.Router();

Router.route("/register").post(authValidation.register, authController.register);

export const authRouter = Router;