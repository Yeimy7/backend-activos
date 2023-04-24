import nodemailer from 'nodemailer';
import * as config from './config'

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: config.EMAIL, // generated ethereal user
    pass: config.PASSWORD // generated ethereal password
  },
});

transporter.verify().then(() => {
  console.log('Ready for send emails');
})