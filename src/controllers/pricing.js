import { Pricing } from '../models/index.js';

export const create = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    const { title, price, maxJobCount } = req.body;
    const result = await Pricing.create({ title, price, maxJobCount });
    return res.status(200).send(result);
  } catch (error) {
    next(error);
  }
};
export const getAll = async (req, res, next) => {
  try {
    const { id } = req.params;
    const pricings = await Pricing.findAll();
    if (!pricings) {
      return res.status(404).send({ success: false });
    }
    return res.status(200).json({ success: true, pricings });
  } catch (error) {
    next(error);
  }
};

export const getOne = async (req, res, next) => {
  try {
    const { id } = req.params;
    const pricing = await Pricing.findByPk(id);
    if (!pricing) {
      return res.status(404).send({ success: false });
    }
    return res.status(200).json({ success: true, pricing });
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { id } = req.params;
    const { title, price, maxJobCount } = req.body;

    const pricing = await Pricing.findByPk(id);
    if (!pricing) {
      return res.status(404).send({ success: false });
    }

    const result = await Pricing.update({ title, price, maxJobCount }, { where: { id } });
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

    const { id } = req.params;
    const pricing = await Pricing.findByPk(id);
    if (!pricing) {
      return res.status(404).send({ success: false });
    }
    await Pricing.destroy({ where: { id } });
    return res.status(200).send({ success: true });
  } catch (error) {
    next(error);
  }
};
