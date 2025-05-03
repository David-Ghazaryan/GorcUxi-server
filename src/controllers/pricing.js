import { Pricing } from '../models/index.js';

export const create = async (req, res, next) => {
  try {
    const { title, price, maxJobCount } = req.body;
    await Pricing.create({ title, price, maxJobCount });

    return res.status(201);
  } catch (error) {
    next(error);
  }
};

export const getAll = async (req, res, next) => {
  try {
    const data = await Pricing.findAll();
    return res.json(data);
  } catch (error) {
    next(error);
  }
};

export const getOne = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = await Pricing.findByPk(id);
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
    const { id } = req.params;
    const { title, price, maxJobCount } = req.body;

    await Pricing.update({ title, price, maxJobCount }, { where: { id } });
    return res.status(200).end();
  } catch (error) {
    next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Pricing.destroy({ where: { id } });
    return res.status(204).end();
  } catch (error) {
    next(error);
  }
};
