/////YE NHI CHLA HAI ISME KOI DIKKAT AAGYI HAI video 3:08
const nodeMailer=require("nodemailer");

const sendEmail = async (options) => {
    const transporter = nodeMailer.createTransport({
        //smpt nhi smtp hona chaiye, but chlne dete h
      host: process.env.SMPT_HOST,
      port: process.env.SMPT_PORT,
      service: process.env.SMPT_SERVICE,
      auth: {
        user: process.env.SMPT_MAIL,
        pass: process.env.SMPT_PASSWORD,
      },
    });
  
    const mailOptions = {
      from: process.env.SMPT_MAIL,
      to: options.email,
      subject: options.subject,
      text: options.message,
    };
  
    await transporter.sendMail(mailOptions);
  };
  
  module.exports = sendEmail;