import { Company, Job, JobView, JobApply, User, UserInfo } from '../models/index.js';
import { Op } from 'sequelize';

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
    } = req.body;

    const company = await Company.findOne({ where: { id: companyId, userId } });

    if (!company) {
      return res.status(400).json({ success: false });
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
    });

    return res.status(201).send({success: true});
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
      return res.status(400).json({ success: false });
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
      },
      { where: { id } },
    );

    return res.status(200).send({success: true});
  } catch (error) {
    next(error);
  }
};

export const remove = async (req, res, next) => {
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
      return res.status(400).json({ success: false });
    }

    await Job.destroy({ where: { id } });

    return res.send({success: true});
  } catch (error) {
    next(error);
  }
};

export const getAll = async (req, res, next) => {
  try {
    const { limit = 10, page = 1, q } = req.params;
    const offset = (+page - 1) * +limit;
    const data = await Job.findAll({
      where: {
        [Op.or]: [
          { title: { [Op.iLike]: `%${q}%` } },
          { description: { [Op.iLike]: `%${q}%` } },
          { city: { [Op.iLike]: `%${q}%` } },
        ],
      },
      limit,
      offset,
      include: { model: Company, as: 'company' },
    });

    return res.status(data);
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
    });

    JobView.upsert({
      userIP,
      jobId: id,
    });

    return res.json(data);
  } catch (error) {
    next(error);
  }
};

export const createJobApply = async (req, res, next) => {
  try {
    const { jobId } = req.body;
    const { id } = req.user;
    const condidate = await User.findByPk({ id }, { include: [{ model: UserInfo, as: 'info' }] });

    if (!condidate.UserInfo.cvUrl) {
      return res.status(400).json({
        success: false,
        message: 'CV is required ',
      });
    }

    const data = await JobApply.findOne({
      where: { userId, jobId },
    });

    if (data) {
      return res.status(400).json({ success: false });
    }

    await JobApply.create({
      userId: req.user.id,
      jobId,
      userIP: req.ip,
    });

    return res.status(201);
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
    return res.status(200);
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
