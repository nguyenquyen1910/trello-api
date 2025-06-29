import { StatusCodes } from "http-status-codes";
import { cardService } from "../services/cardService.js";

const createNew = async (req, res, next) => {
  try {
    const createdCard = await cardService.createNew(req.body);
    res.status(StatusCodes.CREATED).json({
      message: "Card created successfully",
      data: {
        card: createdCard,
      },
    });
  } catch (error) {
    next(error);
  }
};

const moveCard = async (req, res, next) => {
  try {
    const cardId = req.params.id;
    const moveCardData = {
      sourceColumnId: req.body.sourceColumnId,
      destinationColumnId: req.body.destinationColumnId,
      destinationOrderIds: req.body.destinationOrderIds,
    };
    const movedCard = await cardService.moveCard(cardId, moveCardData);
    res.status(StatusCodes.OK).json({
      message: "Card moved successfully",
      data: {
        card: movedCard,
      },
    });
  } catch (error) {
    next(error);
  }
};

const deleteCard = async (req, res, next) => {
  try {
    const cardId = req.params.id;
    const deletedCard = await cardService.deleteCard(cardId);
    res.status(StatusCodes.OK).json({
      message: "Card deleted successfully",
      data: {
        card: deletedCard,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const cardController = {
  createNew,
  moveCard,
  deleteCard,
};
