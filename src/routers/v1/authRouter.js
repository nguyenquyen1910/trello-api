import express from "express";
import { authController } from "../../controllers/authController.js";
import { authValidation } from "../../validations/authValidation.js";
import { authMiddleware } from "../../middlewares/authMiddleware.js";

const Router = express.Router();

Router.route("/register").post(
  authValidation.register,
  authController.register
);
Router.route("/login").post(authValidation.login, authController.login);
Router.route("/logout").post(
  authMiddleware.authenticateToken,
  authController.logout
);
Router.route("/logout-all").post(
  authMiddleware.authenticateToken,
  authController.logoutAllSessions
);
Router.route("/refresh").post(authController.refreshToken);
Router.route("/forgot").post(authController.forgotPassword);
Router.route("/reset").post(
  authValidation.resetPassword,
  authController.resetPassword
);

export const authRouter = Router;
