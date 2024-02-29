import nodemailer, { SentMessageInfo } from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

export const emailSend = (to: string, subject: string, text: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.ADMIN_EMAIL,
        pass: process.env.ADMIN_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.ADMIN_EMAIL,
      to: to,
      subject: subject,
      text: text,
    };

    transporter.sendMail(mailOptions, (err: Error | null, info: SentMessageInfo) => {
      if (err) {
        console.error('Error occurred while sending email:', err);
        reject(err);
      } else {
        console.log('Email is sent to ' + info.response);
        resolve(true);
      }
    });
  });
};
