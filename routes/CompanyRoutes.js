const express = require('express');
const CompanyRouter = express.Router();
const { addCompany, getAllCompanies, getCompanyByName } = require('../controllers/CompanyController');

CompanyRouter.post('/add', addCompany);

CompanyRouter.get('/getallcompanies', getAllCompanies);  

CompanyRouter.get('/getonecompany/:name', getCompanyByName);

module.exports = CompanyRouter;
