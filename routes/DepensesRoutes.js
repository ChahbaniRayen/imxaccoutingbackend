const express = require("express");
const DepensesRouter = express.Router();
const {
  createDepense,
  getAllDepenses,
  getDepenseById,
  updateDepense,
  deleteDepense,
  getAportDepenses,
  getAllcategoriesDepenses,
  getAllfinacesDepenses,
} = require("../controllers/DepensesController");
const {
  getTypeFinSubcategory2,
} = require("../controllers/GetterDepensesController");

// Route pour créer une dépense
DepensesRouter.post("/add", createDepense);

// Route pour récupérer toutes les dépenses
DepensesRouter.get("/depenses", getAllDepenses);

// Route pour récupérer une dépense par ID
DepensesRouter.get("/depenses/:id", getDepenseById);

// Route pour récupérer les types de financement sous-catégorie 2 pour une dépense donnée
DepensesRouter.post("/get-type-fin-subcategory2", getTypeFinSubcategory2);
// Route pour mettre à jour une dépense par ID
DepensesRouter.put("/depenses/:depenseId", updateDepense);

// Route pour supprimer une dépense par ID
DepensesRouter.delete("/depenses/:id", deleteDepense);
DepensesRouter.get("/DepensesApport/:id", getAportDepenses);
DepensesRouter.get("/getAllcategoriesDepenses", getAllcategoriesDepenses);
DepensesRouter.get("/getAllfinacesDepenses", getAllfinacesDepenses);
module.exports = DepensesRouter;
