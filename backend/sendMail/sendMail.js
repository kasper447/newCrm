const nodemailer = require('nodemailer');
require('dotenv').config();

const transport = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,  // Correct port for Gmail with SSL
    secure: true,
    auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASSWORD
    }
});

const SendMails = async (otp, email) => {
    try {
        const info = await transport.sendMail({
            from: process.env.AUTH_EMAIL,
            to: email,
            subject: "Forgot Password",
            text: "Verify your email id",
            html : `<b>${otp}</b>`
        });
        console.log("Email sent: ");
    } catch (error) {
        console.error("Error sending email: ", error);
    }
};

module.exports = SendMails;
