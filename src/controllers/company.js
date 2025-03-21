import { Company, Job } from "../models";
import { Op } from "sequelize";

export const create = async (req, res, next) => {
  try {
    const { id } = req.user;
    const {
      title,
      logo,
      mail,
      backgroundImage,
      phoneNumber,
      minWorkes,
      maxWorkes,
      location,
      description,
    } = req.body;

    await Company.create({
      title,
      logo,
      mail,
      backgroundImage,
      phoneNumber,
      minWorkes,
      maxWorkes,
      location,
      description,
      userId: id,
    });

    return res.status(201);
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const { id: userId } = req.user;
    const { id } = req.params;
    const {
      title,
      logo,
      mail,
      backgroundImage,
      phoneNumber,
      minWorkes,
      maxWorkes,
      location,
      description,
    } = req.body;

    await Company.update(
      {
        title,
        logo,
        mail,
        backgroundImage,
        phoneNumber,
        minWorkes,
        maxWorkes,
        location,
        description,
      },
      { where: { id, userId } }
    );

    return res.status(200);
  } catch (error) {
    next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    const { id: userId } = req.user;
    const { id } = req.params;

    await Company.destroy({ where: { id, userId } });

    return res.status(204);
  } catch (error) {
    next(error);
  }
};

export const getAll = async (req, res, next) => {
  try {
    const { limit = 10, page = 1, q } = req.params;
    const offset = (+page - 1) * +limit;
    const data = await Company.findAll({
      where: {
        [Op.or]: [
          { title: { [Op.iLike]: `%${q}%` } },
          { description: { [Op.iLike]: `%${q}%` } },
        ],
      },
      limit,
      offset,
      include: { model: Job, as: "jobs" },
    });

    return res.status(data);
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const { id: userId } = req.user;

    const data = await Company.findAll({
      where: {
        userId,
      },
      include: { model: Job, as: "jobs" },
    });

    return res.status(data);
  } catch (error) {
    next(error);
  }
};

export const getOne = async (req, res, next) => {
  try {
    const { id } = req.params;

    const data = await Company.findByPk(id, {
      include: { model: Job, as: "jobs" },
    });

    return res.json(data);
  } catch (error) {
    next(error);
  }
};
