import { User } from "../models";

export const update = async (req, res, next) => {
  try {
    const { id } = req.user;
    const { gender, cvUrl, info, city, industryId, scheduleType, salary } =
      req.body;

    await User.update(
      { gender, cvUrl, info, city, industryId, scheduleType, salary },
      { where: { id } }
    );

    return res.status(200);
  } catch (error) {
    next(error);
  }
};
