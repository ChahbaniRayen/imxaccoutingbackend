const mongoose = require('mongoose');

const DepensesSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
  category: [
    {
      categoryName: { type: String, required: true }, 
      subcategories: [{ type: String, required: false }], 
    },
  ],
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

const Depenses = mongoose.model('Depenses', DepensesSchema);

module.exports = Depenses;
