const mongoose = require("mongoose");

const DepensesSchema = new mongoose.Schema({
  depenseapport: { type: String, enum: ["apport", "depense"] },
  amount: { type: Number, required: true },
  date: { type: Date },
  category: [
    {
      categoryName: { type: String },
      subcategories: [{ type: String }],
    },
  ],
  description: { type: String },
  account: { type: String },
  finances: [
    {
      type: { type: String, enum: ["credit", "debit"] },

      finsubcategoryname: { type: String },
      finsubcategory2: [{ type: String }],

      balance: { type: Number },
    },
  ],
  company: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
});

const Depenses = mongoose.model("Depenses", DepensesSchema);

module.exports = Depenses;
