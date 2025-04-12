const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_FROM,
    pass: process.env.EMAIL_PASS,
  },
});

const FRONTEND_URL = process.env.FRONTEND_URL;

const sendVerifyEmail = async (mail, token) => {
  const link = `${FRONTEND_URL}/verify-email?token=${token}`;

  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2>Verify Your Email</h2>
      <p>Click the button below to verify your email address.</p>
      <a href="${link}" style="display:inline-block; padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">Verify Email</a>
      <p>If you didn’t request this, you can safely ignore this email.</p>
    </div>
  `;

  await transporter.sendMail({
    from: `"Your Company Name" <${process.env.EMAIL_FROM}>`,
    to: mail,
    subject: "Verify Your Email",
    html,
  });
};

const sendForgotPasswordEmail = async (mail, token) => {
  const link = `${FRONTEND_URL}/reset-password?token=${token}`;

  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2>Reset Your Password</h2>
      <p>Click the button below to reset your password.</p>
      <a href="${link}" style="display:inline-block; padding: 10px 20px; background-color: #2196F3; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
      <p>If you didn’t request this, you can safely ignore this email.</p>
    </div>
  `;

  await transporter.sendMail({
    from: `"Your Company Name" <${process.env.EMAIL_FROM}>`,
    to: mail,
    subject: "Reset Your Password",
    html,
  });
};

export { sendVerifyEmail, sendForgotPasswordEmail };
