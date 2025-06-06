import { Company, Job } from '../models/index.js';
import { Op } from 'sequelize';

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
      webSite,
      industryId,
      city,
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
      webSite,
      industryId,
      city,
    });

    return res.status(201).json({ success: true });
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
      webSite,
      industryId,
      city,
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
        webSite, // Added
        industryId, // Added
        city, // Added
        userId,
      },
      { where: { id: +id, userId } },
    );

    return res.status(200).json({ success: true });
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
    const { limit = 10, page = 1, q, city, hasJobs } = req.query;
    const offset = (+page - 1) * +limit;

    const where = {};

    if (q) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${q}%` } },
        { description: { [Op.iLike]: `%${q}%` } },
      ];
    }
    if (city) {
      where.city = city;
    }
    const { rows: data, count: total } = await Company.findAndCountAll({
      where,
      limit,
      offset,
      include: { model: Job, as: 'jobs', required: hasJobs === 'true' },
      order: [['id', 'DESC']],
    });

    return res.json({
      data,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / limit),
      },
    });

    return res.send(data);
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
      include: { model: Job, as: 'jobs' },
    });

    return res.send(data);
  } catch (error) {
    next(error);
  }
};

export const getOne = async (req, res, next) => {
  try {
    const { id } = req.params;

    const data = await Company.findByPk(id, {
      include: { model: Job, as: 'jobs' },
    });

    return res.json(data);
  } catch (error) {
    next(error);
  }
};
