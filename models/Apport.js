const mongoose = require('mongoose');

const ApportSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
  description: { type: String, required: true },
  account: { type: String, required: true },
  finances: [
      {
        type: { type: String, enum: ['credit', 'debit'], required: true },
        finsubcategory1: { 
          finsubcategoryname : { type: String, required: true },
          finsubcategory2: [{ type: String, required: true }],
        },
        balance: { type: Number, required: true },
      },
    ],
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
  });
  
  const Apport = mongoose.model('Apport', ApportSchema);
  
  module.exports = Apport;
  