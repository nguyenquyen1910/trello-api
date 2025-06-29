import express from "express";
import { columnValidation } from "../../validations/columnValidation.js";
import { columnController } from "../../controllers/columnController.js";

const Router = express.Router();

Router.route("/").post(columnValidation.createNew, columnController.createNew);
Router.route("/reorder").put(
  columnValidation.reorderCardInColumn,
  columnController.reorderCardInColumn
);
Router.route("/:id")
  .put(columnValidation.update, columnController.update)
  .delete(columnController.deleteColumn);

export const columnRouter = Router;
