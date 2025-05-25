import { User } from '../models/index.js';

export const update = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { gender, cvUrl, info, city, industryId, scheduleType, salary } = req.body;

    await User.update(
      { gender, cvUrl, info, city, industryId, scheduleType, salary },
      { where: { id } },
    );

    return res.status(200).end();
  } catch (error) {
    next(error);
  }
};
