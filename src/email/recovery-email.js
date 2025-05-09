
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendRecoverEmail = async (to, recoveryLink) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: "Recuperación de contraseña",
    html: `<p>Haz clic en el siguiente enlace para recuperar tu contraseña:</p><a href="${recoveryLink}">${recoveryLink}</a>`,
  });
};

module.exports = {
  sendRecoverEmail,
};
