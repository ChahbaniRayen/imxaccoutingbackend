const Company = require("../models/Company"); 

const addCompany = async (req, res) => { 
    const { name } = req.body; 
    try { 
        const newCompany = new Company({ name }); 
        await newCompany.save(); 
        res.status(201).json({ message: 'Company added successfully', company: newCompany });
    } catch (error) { 
        res.status(500).json({ message: 'Error adding company', error });
    }
}; 

const getCompanyByName = async (req, res) => {
    const { name } = req.params; 
    try { 
        const company = await Company.findOne({ name }); 
        if (!company) return res.status(404).json({ message: 'Company not found' });
        res.json({ company });
    } catch (error) { 
        res.status(500).json({ message: 'Error retrieving company', error });
    } 
}; 

const getAllCompanies = async (req, res) => {
    try { 
        const companies = await Company.find(); 
        res.json({ companies });
    } catch (error) { 
        res.status(500).json({ message: 'Error retrieving companies', error });
    }
}; 

module.exports = { 
    addCompany,
    getCompanyByName,
    getAllCompanies
};
