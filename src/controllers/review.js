import { Review } from '../models/index.js';

export const create = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { id: userId } = req.user;
    const { text, rate } = req.body;
    const review = await Review.create({ userId, text, rate });

    return res.status(200).json({ success: true, review });
  } catch (error) {
    next(error);
  }
};

export const getAll = async (req, res, next) => {
  try {
    const { id } = req.params;
    const reviews = await Review.findAll({ where: { userId: id } });
    if (!reviews) {
      return res.status(404).send({ success: false });
    }
    return res.status(200).json({ success: true, reviews });
  } catch (error) {
    next(error);
  }
};

export const getOne = async (req, res, next) => {
  try {
    const { id } = req.params;
    const review = await Review.findByPk(id);
    if (!review) {
      return res.status(404).send({ success: false });
    }
    return res.status(200).json({ success: true, review });
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { id: userId } = req.user;
    const { id } = req.params;
    const { text, rate } = req.body;

    const review = await Review.findByPk(id);
    if (!review) {
      return res.status(404).send({ success: false });
    }

    const result = await Review.update({ text, rate }, { where: { id, userId } });
    return res.status(200).json({ success: true, result });
  } catch (error) {
    next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { id: userId } = req.user;
    const { id } = req.params;
    const review = await Review.findByPk(id);
    if (!review) {
      return res.status(404).send({ success: false });
    }
    await Review.destroy({ where: { id, userId } });
    return res.status(200).send({ success: true });
  } catch (error) {
    next(error);
  }
};
