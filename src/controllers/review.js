import { Review, User } from "../models/index.js";

export const create = async (req, res, next) => {
  try {
    const { id: userId } = req.user;
    const { text, stars } = req.body;
    await Review.create({ userId, text, stars, rate });

    return res.status(201);
  } catch (error) {
    next(error);
  }
};

export const getAll = async (req, res, next) => {
  try {
    const data = await Review.findAll({
      include: [{
        model: User,
        as: 'user'
      }]
    });
    return res.json(data);
  } catch (error) {
    next(error);
  }
};

export const getOne = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await Review.findOne({
      where: {id},
      include: [{
        model: User,
        as: 'user'
      }]
    });
    if (!data) {
      return res.status(404).send({ success: false });
    }
    return res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const { id: userId } = req.user;
    const { id } = req.params;
    const { text, stars } = req.body;

    await Review.update({ text, stars, rate }, { where: { id, userId } });
    return res.status(200);
  } catch (error) {
    next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    const { id: userId } = req.user;
    const { id } = req.params;
    await Review.destroy({ where: { id, userId } });
    return res.status(200).send({ success: true });
  } catch (error) {
    next(error);
  }
};
