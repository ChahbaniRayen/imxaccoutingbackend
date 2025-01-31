const Apport = require('../models/Apport');
const Company = require('../models/Company'); 
const mongoose = require('mongoose'); 


const createApport = async (req, res) => {
  try {
    const { amount, date, description, account, finances, company } = req.body; 
    console.log("company:",company);

    if (!amount || !date || !description || !account || !company) {
      return res.status(400).json({ error: "Tous les champs requis doivent être remplis." });
    }

    if (finances && !Array.isArray(finances)) {
      return res.status(400).json({ error: "Le champ finances doit être un tableau." });
    }

    const newApport = new Apport({ amount, date, description, account, finances, company });
    await newApport.save();
    return res.status(201).json(newApport);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erreur serveur", details: error.message });
  }
};

const getAllApports = async (req, res) => {
  try {
    const apports = await Apport.find();
    return res.status(200).json(apports);
  } catch (error) {
    return res.status(500).json({ error: "Erreur serveur", details: error.message });
  }
};

const getApportById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID invalide" });
    }

    const apport = await Apport.findById(id);
    if (!apport) {
      return res.status(404).json({ message: "Apport non trouvé" });
    }
    return res.status(200).json(apport);
  } catch (error) {
    return res.status(500).json({ error: "Erreur serveur", details: error.message });
  }
};

const updateApport = async (req, res) => {
  try { 
    console.log("Params reçus:", req.params); 
    console.log("Body reçu:", req.body);     
    const { id } = req.params; 
    const updateData = req.body;  

    console.log("apportId:", id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "ID d'apport invalide" });
    }

    if (updateData.finances) {
      // Vérifier que la structure des finances est correcte
      if (updateData.finances.some(finance => !finance.type || !finance.finsubcategory1 || !Array.isArray(finance.finsubcategory2) || !finance.balance)) {
        return res.status(400).json({ error: "Les finances doivent avoir une structure valide." });
      }
    }

    const updatedApport = await Apport.findByIdAndUpdate(
      id,
      { $set: updateData }, 
      { new: true, runValidators: true }
    );

    if (!updatedApport) {
        return res.status(404).json({ message: "Apport non trouvé" });
    }

    res.status(200).json(updatedApport);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur", details: error.message });
  }
};

const deleteApport = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID invalide" });
    }

    const deletedApport = await Apport.findByIdAndDelete(id);
    if (!deletedApport) {
      return res.status(404).json({ message: "Apport non trouvé" });
    }
    return res.status(200).json({ message: "Apport supprimé avec succès" });
  } catch (error) {
    return res.status(500).json({ error: "Erreur serveur", details: error.message });
  }
};
// getapportby company name  
const getApportsByCompanyName = async (req, res) => {
  try {
    const { companyName } = req.params; // Get the company name from the request parameters

    // Find the company by name
    const company = await Company.findOne({ name: companyName });
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    // Find all Apports associated with the company ID
    const apports = await Apport.find({ company: company._id }).populate('company');

    if (apports.length === 0) {
      return res.status(404).json({ message: "No Apports found for this company" });
    }

    return res.status(200).json(apports);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error", details: error.message });
  }
};

module.exports = {
  createApport,
  getAllApports,
  getApportById,
  updateApport,
  deleteApport, 
  getApportsByCompanyName,
};
