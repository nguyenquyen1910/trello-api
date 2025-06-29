import { columnModel } from "../models/columnModel.js";
import { cardModel } from "../models/cardModel.js";
import { slugify } from "../utils/formatters.js";

const createNew = async (cardData) => {
  try {
    const newCardData = {
      ...cardData,
      slug: slugify(cardData.title),
    };
    const getNewCard = await cardModel.createNew(newCardData);

    const newCard = await cardModel.findOneById(getNewCard.insertedId);

    if (newCard) {
      await columnModel.pushCardOrderIds(newCard);
    }
    return newCard;
  } catch (error) {
    throw new Error(error);
  }
};

const moveCard = async (cardId, moveCardData) => {
  try {
    const { sourceColumnId, destinationColumnId, destinationOrderIds } =
      moveCardData;
    await cardModel.updateColumn(cardId, destinationColumnId);

    if (sourceColumnId !== destinationColumnId) {
      await columnModel.removeCardFromOrder(sourceColumnId, cardId);
    }

    await columnModel.updateCardOrderIds(
      destinationColumnId,
      destinationOrderIds
    );
    return await cardModel.findOneById(cardId);
  } catch (error) {
    throw new Error(error);
  }
};

const deleteCard = async (cardId) => {
  try {
    const card = await cardModel.deleteCard(cardId);
    return card;
  } catch (error) {
    throw new Error(error);
  }
};

export const cardService = {
  createNew,
  moveCard,
  deleteCard,
};
