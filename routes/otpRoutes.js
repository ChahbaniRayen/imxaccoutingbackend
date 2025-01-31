const express = require ( 'express' ); 
const otpController = require ("../controllers/otpController"); 
const otpRouter = express.Router ( ) ; 
otpRouter.post ( '/send-otp' , otpController.sendOTP );  
otpRouter.post('/verify-otp', otpController.verifyOTP);

module .exports = otpRouter;
