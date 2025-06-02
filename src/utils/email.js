import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_FROM,
    pass: process.env.EMAIL_PASS,
  },
});

const FRONTEND_URL = process.env.FRONTEND_URL;

const sendVerifyEmail = async (mail, token) => {
  const link = `${FRONTEND_URL}/verify-email?token=${token}`;

  const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #EDF1F9; color: #0f687e;">
  <h2 style="color: #0f687e;">Հաստատեք Ձեր էլ. փոստի հասցեն</h2>
  <p>Խնդրում ենք սեղմել ներքևի կոճակին՝ Ձեր էլ. հասցեն հաստատելու համար։</p>
  <a href="${link}" style="display:inline-block; padding: 12px 24px; background-color: #0f687e; color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">
    Հաստատել էլ. հասցեն
  </a>
  <p style="margin-top: 20px;">Եթե Դուք չեք նախաձեռնել այս գործողությունը, կարող եք պարզապես անտեսել այս նամակը։</p>
</div>
  `;

  await transporter.sendMail({
    from: `"ԳործՈւղի" <${process.env.EMAIL_FROM}>`,
    to: mail,
    subject: 'Verify Your Email',
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
    from: `"ԳործՈւղի" <${process.env.EMAIL_FROM}>`,
    to: mail,
    subject: 'Reset Your Password',
    html,
  });
};

export { sendVerifyEmail, sendForgotPasswordEmail };
