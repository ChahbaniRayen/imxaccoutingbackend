const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Utilise TLS, pas SSL
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false, // Permet d'ignorer les erreurs de certificat
  },
});

const mailSender = async (email, subject, htmlContent) => {
  try {
    const info = await transporter.sendMail({
      from: `"ImxAccouting" <${process.env.MAIL_USER}>`,
      to: email,
      subject: subject,
      html: htmlContent,
    });
    console.log("E-mail envoyé avec succès :", info.response);
    return info;
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'e-mail :", error);
    throw error;
  }
};

module.exports = mailSender;
