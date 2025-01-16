const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: 'SEU EMAIL',
      pass: 'SUA SENHA',
    }
  });

  module.exports = transporter