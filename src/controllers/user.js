import { Op } from "sequelize";
import { User, Industry, UserInfo } from "../models/index.js";

export const update = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { avatar, fullName, gender, cvUrl, info, city, industryId, scheduleType, salary, industryName, phoneNumber, level } =
      req.body;

    await UserInfo.update(
      { gender, cvUrl, info, city, industryId, scheduleType, salary, industryName, phoneNumber, level },
      { where: { userId: id } }
    );

    await User.update(
      { avatar, fullName },
      { where: { id } }
    );

    return res.status(200).end();
  } catch (error) {
    next(error);
  }
};


export const getOne = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findOne({
      where: { id },
      include: { model: UserInfo, as: 'info', include: [{ model: Industry, as: 'industry' }] },
    });

    if (!user) {
      return res.status(404).json({ success: false });
    }

    return  res.send(user)
  } catch (error) {
    next(error);
  }
};



export const getAll = async (req, res, next) => {
  try {
    const { limit = 10, page = 1, q, nameQ, city, gender, hasSalary, scheduleType, industryName } = req.query;
    const offset = (+page - 1) * +limit;

    const where = {};
    const mainWhere = {
      role: {[Op.not]: "ADMIN"}
    };

    if(nameQ) {
      mainWhere.info =  { [Op.iLike]: `%${q}%` }
    }

    if (q) {
      where.info = { [Op.iLike]: `%${q}%` }
    }
    if (city) {
      where.city = city;
    }
    if (gender) {
      where.gender = gender;
    }
    if (scheduleType) {
      where.scheduleType = scheduleType;
    }
    if (industryName) {
      where.industryName = industryName;
    }
    if (hasSalary === 'true') {
      where.salary = {[Op.gt]: 0};
    }
    const { rows: data, count: total } = await User.findAndCountAll({
      where: mainWhere,
      limit,
      offset,
      include: { model: UserInfo, as: 'info', where, include: [{ model: Industry, as: 'industry' }] },
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