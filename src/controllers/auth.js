import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';
import { sendVerifyEmail, sendForgotPasswordEmail } from '../utils/email.js';

export const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email, emailVerified: true } });

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(400).json({ success: false, message: 'INVALID_CREDENTIALS' });
    }

    const accessToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.SECRET_KEY,
      { expiresIn: '168h' },
    );

    return res.send({ ...user.toJSON(), accessToken });
  } catch (error) {
    next(error);
  }
};

export const signUp = async (req, res, next) => {
  try {
    const { email, password, fullName, role } = req.body;
    const { language } = req.query;
    const candidate = await User.findOne({ where: { email } });

    if (!candidate) {
      const passwordHash = await bcrypt.hash(password, 5);
      const newUser = await User.create({
        email,
        password: passwordHash,
        role,
        fullName,
      });

      const verificationToken = jwt.sign(
        { email: newUser.email, role: newUser.role },
        process.env.SECRET_KEY,
        { expiresIn: '1h' },
      );
      await sendVerifyEmail(newUser.email, verificationToken, language);

      return res.send({ success: true });
    }

    if (candidate.emailVerified) {
      return res.status(409).json({ success: false, message: 'EMAIL_IN_USE' });
    }

    const verificationToken = jwt.sign({ email: candidate.email }, process.env.SECRET_KEY, {
      expiresIn: '1h',
    });

    await sendVerifyEmail(candidate.email, verificationToken, language);
    return res.status(409).json({ success: false, message: 'EMAIL_NOT_VERIFIED' });
  } catch (error) {
    next(error);
  }
};

export const verifyEmail = async (req, res, next) => {
  try {
    const { token } = req.body;
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    if (!decoded?.email) {
      return res.status(400).json({ success: false, message: 'INVALID_TOKEN' });
    }

    const user = await User.findOne({ where: { email: decoded.email } });
    if (!user) {
      return res.status(400).json({ success: false, message: 'USER_NOT_FOUND' });
    }

    await User.update({ emailVerified: true }, { where: { email: decoded.email } });
    return res.send({ success: true });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const { language } = req.query;
    const user = await User.findOne({ where: { email, emailVerified: true } });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid email' });
    }

    const token = jwt.sign({ email }, process.env.SECRET_KEY, {
      expiresIn: '1h',
    });
    await sendForgotPasswordEmail(email, token, language);
    return res.send({ success: true });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    if (!decoded?.email) {
      return res.status(400).json({ success: false, message: 'Invalid token' });
    }

    const passwordHash = await bcrypt.hash(password, 5);
    await User.update({ password: passwordHash }, { where: { email: decoded.email } });
    return res.send({ success: true });
  } catch (error) {
    next(error);
  }
};

export const updatePassword = async (req, res, next) => {
  try {
    const { password, oldPassword } = req.body;
    const { id } = req.user;
    const user = await User.findByPk(id);

    if (!bcrypt.compareSync(oldPassword, user.password)) {
      return res.status(400).json({ success: false, message: 'INVALID_CREDENTIALS' });
    }

    const passwordHash = await bcrypt.hash(password, 5);
    await User.update({ password: passwordHash }, { where: { id } });
    return res.send({ success: true });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    const { id } = req.user;
    const user = await User.findOne({ where: { id, isBlocked: false } });

    if (!user) {
      return res.status(404).json({ success: false });
    }

    const accessToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.SECRET_KEY,
      { expiresIn: '168h' },
    );

    return res.json({
      ...user.toJSON(),
      accessToken,
    });
  } catch (error) {
    next(error);
  }
};
