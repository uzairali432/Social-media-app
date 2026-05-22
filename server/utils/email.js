import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT || 587,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendEmail({ to, subject, html, text }) {
  const from = process.env.EMAIL_FROM || `no-reply@${process.env.APP_DOMAIN || 'localhost'}`;
  const info = await transporter.sendMail({ from, to, subject, html, text });
  return info;
}
