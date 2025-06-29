import express from "express";
import { cardValidation } from "../../validations/cardValidation.js";
import { cardController } from "../../controllers/cardController.js";

const Router = express.Router();

Router.route("/").post(cardValidation.createNew, cardController.createNew);
Router.route("/move/:id").put(cardValidation.moveCard, cardController.moveCard);
Router.route("/:id").delete(cardController.deleteCard);

export const cardRouter = Router;
