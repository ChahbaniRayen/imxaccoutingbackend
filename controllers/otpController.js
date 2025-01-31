const otpGenerator = require('otp-generator');
const OTP = require('../models/otpModel');
const User = require('../models/User');

exports.sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    // Vérifier si l'utilisateur est déjà présent
    const checkUserPresent = await User.findOne({ email });

    // Si l'utilisateur n'est pas  trouvé avec l'e-mail fourni
    if (!checkUserPresent) {
      return res.status(401).json({
        success: false,
        message: 'L\'utilisateur n\'est  enregistré',
      });
    }

    let otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    let result = await OTP.findOne({ otp: otp });
    while (result) {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
      });
      result = await OTP.findOne({ otp: otp });
    }

    const otpPayload = { email, otp };
    const otpBody = await OTP.create(otpPayload);

    res.status(200).json({
      success: true,
      message: 'OTP envoyé avec succès',
      otp,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}; 
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Vérifier si l'OTP existe et correspond à l'email
    const otpRecord = await OTP.findOne({ email, otp });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: "OTP invalide ou expiré",
      });
    }

    // Supprimer l'OTP après vérification réussie
    await OTP.deleteOne({ email, otp });

    return res.status(200).json({
      success: true,
      message: "OTP vérifié avec succès",
    });
  } catch (error) {
    console.error("Erreur lors de la vérification de l'OTP :", error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

