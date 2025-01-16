const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: 'lianmiranda26@gmail.com',
      pass: 'ylwi aptz vnwy vofm',
    }
  });

  module.exports = transporter