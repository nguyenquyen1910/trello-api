import { slugify } from "../utils/formatters.js";
import { columnModel } from "../models/columnModel.js";
import { boardModel } from "../models/boardModel.js";

const createNew = async (columnData) => {
  if (!columnData.title) throw new Error("Title is required");
  const newColumnData = {
    ...columnData,
    slug: slugify(columnData.title),
  };
  const getNewColumn = await columnModel.createNew(newColumnData);

  const newColumn = await columnModel.findOneById(getNewColumn.insertedId);

  if (newColumn) {
    newColumn.cards = [];

    await boardModel.pushColumnOrderIds(newColumn);
    await columnModel.pushCardOrderIds(newColumn);
  }
  return newColumn;
};

const update = async (columnId, columnData) => {
  try {
    const updateData = {
      ...columnData,
      updatedAt: Date.now(),
    };
    const updatedColumn = await columnModel.update(columnId, updateData);
    return updatedColumn;
  } catch (error) {
    throw new Error(error);
  }
};

const reorderCardInColumn = async (reorderColumnData) => {
  try {
    const { columnId, newOrderIds } = reorderColumnData;
    const reorderCard = await columnModel.reorderCardInColumn(
      columnId,
      newOrderIds
    );
    return reorderCard;
  } catch (error) {
    throw new Error(error);
  }
};

const deleteColumn = async (columnId) => {
  try {
    const column = await columnModel.deleteColumn(columnId);
    if (column && column.boardId) {
      await boardModel.removeColumnFromOrder(column.boardId, columnId);
    }
    return column;
  } catch (error) {
    throw new Error(error);
  }
};

export const columnService = {
  createNew,
  update,
  reorderCardInColumn,
  deleteColumn,
};
