const Company = require("../models/Company");

const addCompany = async (req, res) => {
  const { name } = req.body;
  console.log("Received company name:", typeof name, name);

  try {
    const existingCompany = await Company.findOne({ name });
    console.log("Existing company:", existingCompany);
    if (existingCompany) {
      return res.status(200).json({
        message: "Company already exists",
        success: true,
        result: { name: existingCompany.name, id: existingCompany._id },
      });
    }

    const newCompany = new Company({ name });
    await newCompany.save();

    res.status(201).json({
      message: "Company added successfully",
      success: true,
      result: { name: newCompany.name, id: newCompany._id },
    });
  } catch (error) {
    console.error("Error adding or updating company:", error);
    res.status(500).json({
      message: "Error adding or updating company",
      success: false,
      error: error.message,
    });
  }
};

const getCompanyByName = async (req, res) => {
  const { name } = req.params;
  try {
    const company = await Company.findOne({ name });
    if (!company) return res.status(404).json({ message: "Company not found" });
    res.json({ company });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving company", error });
  }
};

const getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find();
    res.json({ companies, success: true });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving companies", sucess: false });
  }
};

module.exports = {
  addCompany,
  getCompanyByName,
  getAllCompanies,
};
