import nodemailer from 'nodemailer';
import * as config from './config.js'

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    // type:'OAuth2',  //Al ejecutar con node index.js
    user: config.EMAIL, // generated ethereal user
    pass: config.PASSWORD // generated ethereal password
  },
  tls: {
    rejectUnauthorized: false
  }
});

transporter.verify().then(() => {
  console.log('Ready for send emails');
})