import { Industry } from '../models/index.js';

export const create = async (req, res, next) => {
  try {
    const { title } = req.body;
    await Industry.create({title});
    return res.status(201).send({success: true});
  } catch (error) {
    next(error);
  }
};
export const getAll = async (req, res, next) => {
  try {
    const data = await Industry.findAll();
    return res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title } = req.body;
    await Industry.update({ title }, { where: { id } });
    return res.status(200).send({success: true});
  } catch (error) {
    next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    const { id } = req.params;
    await Industry.destroy({ where: { id } });
    return res.status(204);
  } catch (error) {
    next(error);
  }
};
