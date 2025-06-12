import { Company, Job, JobView, JobApply, User, UserInfo, Industry } from '../models/index.js';
import { Op, fn } from 'sequelize';

export const create = async (req, res, next) => {
  try {
    const { id: userId } = req.user;
    const {
      title,
      description,
      city,
      salary,
      scheduleType,
      level,
      companyId,
      industryId,
      allowStudents,
      deadLine,
    } = req.body;

    const company = await Company.findOne({ where: { id: companyId, userId } });

    if (!company) {
      return res.status(400).json({ success: false, message: 'COMPANY_NOT_FOUND' });
    }

    await Job.create({
      title,
      description,
      city,
      salary,
      scheduleType,
      level,
      companyId,
      industryId,
      allowStudents,
      deadLine,
    });

    return res.status(201).end();
  } catch (error) {
    next(error);
  }
};

export const update = async (req, res, next) => {
  try {
    const { id: userId } = req.user;
    const { id } = req.params;

    const job = await Job.findByPk(id, {
      include: { model: Company, as: 'company' },
    });

    const company = await Company.findOne({
      where: { id: job.companyId, userId },
    });

    if (!company) {
      return res.status(400).json({ success: false, message: 'COMPANY_NOT_FOUND' });
    }

    const {
      title,
      description,
      city,
      salary,
      scheduleType,
      level,
      companyId,
      industryId,
      allowStudents,
      deadLine,
    } = req.body;

    await Job.update(
      {
        title,
        description,
        city,
        salary,
        scheduleType,
        level,
        companyId,
        industryId,
        allowStudents,
        deadLine,
      },
      { where: { id } },
    );

    return res.status(200).end();
  } catch (error) {
    next(error);
  }
};

export const remove = async (req, res, next) => {
  try {
    const { id: userId } = req.user;
    const { id } = req.params;

    const job = await Job.findByPk(id, {
      include: { model: Company, as: 'company', where: { userId } },
    });

    if (!job) {
      return res.status(400).json({ success: false, message: 'JOB_NOT_FOUND' });
    }

    await Job.destroy({ where: { id } });

    return res.status(204).end();
  } catch (error) {
    next(error);
  }
};

export const getAll = async (req, res, next) => {
  try {
    const {
      limit = 10,
      page = 1,
      q = '',
      levels,
      industryIds,
      selectedSalary,
      allowStudents,
      cities,
      scheduleTypes,
    } = req.query;
    const offset = (+page - 1) * +limit;

    let where = {};

    if (q) {
      where = {
        [Op.or]: [
          { title: { [Op.iLike]: `%${q}%` } },
          { description: { [Op.iLike]: `%${q}%` } },
          { city: { [Op.iLike]: `%${q}%` } },
        ],
      };
    }

    if (industryIds) {
      where.industryId = industryIds;
    }
    if (cities) {
      where.city = cities;
    }

    if (selectedSalary === 'true') {
      where.salary = { [Op.gt]: 0 };
    }

    if (levels) {
      where.level = levels;
    }

    if (allowStudents === 'true') {
      where.allowStudents = true;
    }

    if (scheduleTypes !== 'undefined') {
      where.scheduleType = scheduleTypes;
    }

    const { rows: data, count: total } = await Job.findAndCountAll({
      where,
      limit,
      offset,
      include: { model: Company, as: 'company' },
      order: fn('RANDOM'),
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
  } catch (error) {
    next(error);
  }
};

export const getOne = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userIP = req.headers['x-forwarded-for'];

    const data = await Job.findByPk(id, {
      include: { model: Company, as: 'company' },
      include: { model: Industry, as: 'industry' },
    });
    if (!data) {
      return res.status(404).json({ message: 'Job not found' });
    }
    JobView.upsert({
      userIP,
      jobId: id,
    });

    return res.json(data);
  } catch (error) {
    next(error);
  }
};

export const getSimilarJobs = async (req, res, next) => {
  try {
    const { id } = req.params;

    const data = await Job.findAll({ where: { industryId: id }, limit: 3 });

    return res.json(data);
  } catch (error) {
    next(error);
  }
};

export const createJobApply = async (req, res, next) => {
  try {
    const { jobId } = req.body;
    const { id: userId } = req.user;
    const userIP = req.headers['x-forwarded-for'];
    const condidate = await User.findByPk(
      { userId },
      { include: [{ model: UserInfo, as: 'info' }] },
    );

    if (!condidate.info.cvUrl) {
      return res.status(400).json({
        success: false,
        message: 'CV is required',
      });
    }

    const data = await JobApply.findOne({
      where: { userId, jobId },
    });

    if (data) {
      return res.status(400).json({ success: false, message: 'ALREADY_APPLIED' });
    }

    await JobApply.create({
      userId: userId,
      jobId,
      userIP,
    });

    return res.status(201), end();
  } catch (error) {
    next(error);
  }
};

export const getAllJobApplies = async (req, res, next) => {
  try {
    const { id } = req.params;
    await JobApply.findAll({
      where: { jobId: id },
      include: [{ model: Job, as: 'job' }],
    });
    return res.status(200).end();
  } catch (error) {
    next(error);
  }
};

export const removeJobApply = async (req, res, next) => {
  try {
    const { id } = req.params;

    await JobApply.destroy({ where: { id } });

    return res.status(204);
  } catch (error) {
    next(error);
  }
};

export const getUserjobApplies = async (req, res, next) => {
  try {
    const { id: userId } = req.user;

    const jobApplies = await JobApply.findAll({
      where: { userId },
      include: [
        {
          model: Job,
          as: 'job',
          include: [
            {
              model: Company,
              as: 'company',
            },
          ],
        },
      ],
    });

    return res.status(200).json({
      jobApplies,
    });
  } catch (error) {
    next(error);
  }
};
