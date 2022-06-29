const nodemailer = require('nodemailer');
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

const createTransporter = async () => {
    const oauth2Client = new OAuth2(
        process.env.ID_EMAIL,
        process.env.SECRET_EMAIL,
        "https://developers.google.com/oauthplayground"
    );

    oauth2Client.setCredentials({
        refresh_token: process.env.REFRESH_EMAIL
    });

    const accessToken = await new Promise((resolve, reject) => {
        oauth2Client.getAccessToken((err, token) => {
            if (err) {
                reject();
            }
            resolve(token);
        });
    });

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            type: "OAuth2",
            user: process.env.USER_EMAIL,
            accessToken,
            clientId: process.env.ID_EMAIL,
            clientSecret: process.env.SECRET_EMAIL,
            refreshToken: process.env.REFRESH_EMAIL
        }
    });

    return transporter;
};


const sendEmail = async (emailOptions) => {
    try {

        let emailTransporter = await createTransporter();
        await emailTransporter.sendMail(emailOptions);
    } catch (err) {
        console.log(err)
    }

};
module.exports = { sendEmail }