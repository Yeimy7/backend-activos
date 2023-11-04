import nodemailer from 'nodemailer';
import * as config from './config.js';
import dotenv from 'dotenv';
dotenv.config();
export const transporter = nodemailer.createTransport({
  // host:"smtp.office365.com",
  host: "smtp.gmail.com",
  // port: 587,
  port: 465,
  // secure: false, // true for 465, false for other ports
  secure: true,
  // true for 465, false for other ports
  auth: {
    // type:'OAuth2',  //Al ejecutar con node index.js
    user: config.EMAIL,
    pass: config.PASSWORD
  },
  tls: {
    rejectUnauthorized: false
  }
});
transporter.verify().then(() => {
  console.log('Ready for send emails');
});