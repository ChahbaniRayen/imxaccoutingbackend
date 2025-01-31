require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose'); 
const CompanyRouter = require('./routes/CompanyRoutes.js'); 
const UserRouter = require('./routes/UserRoutes.js'); 
const DepensesRouter= require("./routes/DepensesRoutes.js"); 
const ApportRoutes = require("./routes/ApportRoutes.js")
const otpRouter = require("./routes/otpRoutes.js");  
const cors =require("cors")

const app = express();

app.use(express.json());
app.use(cors({
  origin: 'http://10.0.2.2:8081', // adresse de ton application React Native dans l'émulateur Android
  methods: ['GET', 'POST'],
}));


app.use('/api/companies', CompanyRouter);
 app.use('/api/users', UserRouter); 
 app.use('/api/depenses', DepensesRouter); 
 app.use('/api/apport', ApportRoutes); 
 app.use('/api/otp',otpRouter);


mongoose.connect('mongodb://localhost:27017/imxaccounting')
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('MongoDB connection error:', err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
