const nodemailer = require("nodemailer");

const sendMail = (email, mailBody) => {
  new Promise((resolve, reject) => {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      auth: {
        user: "myecentials2021@gmail.com",
        pass: "jguxhutsrymrloxf",
      },
      secure: true,
      tls: {
        servername: "gmail.com",
      },
    });

    const mailOptions = {
      from: "replyus.app@gmail.com",
      to: `${email}`,
      subject: "Ecentials",
      html: mailBody,
    };

    transporter.sendMail(mailOptions, (error) => {
      if (error) {
        reject(error);
      }
      resolve("ok");
    });
  });
};

module.exports = sendMail;
