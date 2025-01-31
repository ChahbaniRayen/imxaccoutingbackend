const express = require("express");
  const ApportRoutes=express.Router(); 

const {
    createApport,
    getAllApports,
    getApportById,
    updateApport,
    deleteApport, 
    getApportsByCompanyName,
  }= require ("../controllers/ApportController") 
  
  ApportRoutes.post('/add',createApport);
  ApportRoutes.get('/getallapports',getAllApports);
  ApportRoutes.get('/getoneapport/:id',getApportById);
  ApportRoutes.get('/apports/:companyName', getApportsByCompanyName);
  ApportRoutes.put('/apports/:id',updateApport); 

  ApportRoutes.delete('/apports/:id',deleteApport);

  module.exports=ApportRoutes;