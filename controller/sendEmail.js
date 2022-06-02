const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
    port: 465,               // true for 465, false for other ports
    host: "smtp.gmail.com",
    auth: {
        type: 'OAuth2',
        user: process.env.USER_EMAIL, // your email
        clientId: process.env.ID_EMAIL, // oauth cliend id 
        clientSecret: process.env.SECRET_EMAIL, // secret 
        refreshToken: "AYjcyMzY3ZDhiNmJkNTY", // refresh token 
        accessToken: "RjY2NjM5NzA2OWJjuE7c" // access token
    },
    secure: true,
});

module.exports = { transporter }