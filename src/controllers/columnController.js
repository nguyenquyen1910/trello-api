import { StatusCodes } from "http-status-codes";
import { columnService } from "../services/columnService.js";

const createNew = async (req, res, next) => {
  try {
    const createdColumn = await columnService.createNew(req.body);
    res.status(StatusCodes.CREATED).json({
      message: "Column created successfully",
      data: {
        column: createdColumn,
      },
    });
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const columnId = req.params.id;
    const updateColumn = await columnService.update(columnId, req.body);

    res.status(StatusCodes.OK).json({
      message: "Column updated successfully",
      data: {
        column: updateColumn,
      },
    });
  } catch (error) {
    next(error);
  }
};

const reorderCardInColumn = async (req, res, next) => {
  try {
    const reorderColumn = await columnService.reorderCardInColumn(req.body);
    res.status(StatusCodes.OK).json({
      message: "Column reordered successfully",
      data: {
        column: reorderColumn,
      },
    });
  } catch (error) {
    next(error);
  }
};

const deleteColumn = async (req, res, next) => {
  try {
    const columnId = req.params.id;
    const deletedColumn = await columnService.deleteColumn(columnId);
    res.status(StatusCodes.OK).json({
      message: "Column deleted successfully",
      data: {
        column: deletedColumn,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const columnController = {
  createNew,
  update,
  reorderCardInColumn,
  deleteColumn,
};
