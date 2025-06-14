import { Review, User, UserInfo } from '../models/index.js';

export const create = async (req, res, next) => {
  try {
    const { id: userId } = req.user;
    const { text, stars } = req.body;
    await Review.create({ userId, text, stars });

    return res.status(201).end();
  } catch (error) {
    next(error);
  }
};

export const getAll = async (req, res, next) => {
  try {
    const data = await Review.findAll({
      include: [
        {
          model: User,
          as: 'user',
          include: [
            {
              model: UserInfo,
              as: 'info',
            },
          ],
        },
      ],
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
      where: { id },
      include: [
        {
          model: User,
          as: 'user',
        },
      ],
    });
    if (!data) {
      return res.status(404).send({ success: false });
    }
    return res.json(data);
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
    return res.status(200).end();
  } catch (error) {
    next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    const { id: userId } = req.user;
    const { id } = req.params;
    await Review.destroy({ where: { id, userId } });
    return res.status(204).end();
  } catch (error) {
    next(error);
  }
};
