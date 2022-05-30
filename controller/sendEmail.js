const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
    port: 465,               // true for 465, false for other ports
    host: "smtp.gmail.com",
    auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.PASSWORD_EMAIL,
    },
    secure: true,
});

module.exports = { transporter }