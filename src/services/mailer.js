require("dotenv").config();
const nodemailer = require("nodemailer");

const user = process.env.MAILER_USER;
const pass = process.env.MAILER_PASS;

const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  secure: false,
  auth: {
    user: user,
    pass: pass,
  },
});

// Function to send an email
const sendMail = ({ to, subject, code }) => {
  const mailOptions = {
    from: user,
    to: to,
    subject: subject,
    text: `Hi there,

    Thank you for creating an account with us. To complete your registration, please use the following verification code:

    ${code}

    If you didn't request this code, please ignore this email. For any questions or issues, feel free to contact our support team.

    Best regards,`,
  };

  try {
    return transporter.sendMail(mailOptions);
  } catch (error) {
    console.log("error", error);
    // throw error;
  }
};

module.exports = { sendMail };
