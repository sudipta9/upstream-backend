const nodemailer = require("nodemailer");

const sendMail = (sendTo, mailSubject, mailBody) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "anonymous69devil@gmail.com",
      pass: "_r9eAxRNJjbFW76",
    },
  });

  transporter.sendMail({
    from: '"support@upstream" <anonymous69devil@gmail.com>', // sender address
    to: sendTo, // list of receivers
    subject: mailSubject, // Subject line
    text: mailBody, // plain text body
  });
};

module.exports = sendMail;
