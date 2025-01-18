const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.ADDRESS_EMAIL,
      pass: process.env.PASSWORD_EMAIL,
    }
  });

  module.exports = transporter