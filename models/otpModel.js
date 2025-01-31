const mongoose = require('mongoose');
const mailSender = require("../Utilis/mailSender");

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 5, // Expire après 5 minutes
  },
});

// Fonction pour envoyer un e-mail OTP
async function sendVerificationEmail(email, otp) {
  try {
    await mailSender(
      email,
      "E-mail de vérification",
      `<h1>Code OTP</h1>
       <p>Votre code de vérification est : <strong>${otp}</strong>. Il expirera dans 5 minutes.</p>`
    );
    console.log("E-mail envoyé avec succès");
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'e-mail :", error);
    throw error;
  }
}

// Hook avant d'enregistrer un OTP
otpSchema.pre("save", async function (next) {
  if (this.isNew) {
    await sendVerificationEmail(this.email, this.otp);
  }
  next();
});

module.exports = mongoose.model("OTP", otpSchema);
