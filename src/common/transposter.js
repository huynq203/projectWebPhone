const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: "quochuy2011nd@gmail.com",
        pass: "dbqr mfmr dgfn uyrr",
    }
});
module.exports = transporter;