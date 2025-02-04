const Depenses = require("../models/Depenses");
const Apport = require("../models/Apport");
const mongoose = require("mongoose");

const getAportDepenses = async (req, res) => {
  try {
    const id = req.params.id;
    const apportsdata = await Apport.find({ company: id });
    const Depensesdata = await Depenses.find({ company: id });

    const apportsdataWithFlag = apportsdata.map((apport) => ({
      ...apport.toObject(),
      apport: true,
    }));
    const depensesdataWithFlag = Depensesdata.map((depense) => ({
      ...depense.toObject(),
      depense: true,
    }));
    const finalData = [...apportsdataWithFlag, ...depensesdataWithFlag].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

    return res.status(200).json({ result: { finalData }, success: true });
  } catch (error) {
    return res.status(500).json({
      error: "Erreur serveur",
      success: false,
      message: error.message,
    });
  }
};
// const createDepense = async (req, res) => {
//   try {
//     const { amount, date, category, description, account, finances, company } =
//       req.body;

//     // Validation des données avant insertion
//     if (!amount || !date || !category || !description || !account || !company) {
//       return res
//         .status(400)
//         .json({ error: "Tous les champs requis doivent être remplis." });
//     }

//     // Vérification que chaque category a bien un categoryName et des subcategories
//     if (
//       !Array.isArray(category) ||
//       category.some(
//         (cat) => !cat.categoryName || !Array.isArray(cat.subcategories)
//       )
//     ) {
//       return res.status(400).json({
//         error:
//           "Chaque catégorie doit avoir un nom et une liste de sous-catégories.",
//       });
//     }

//     // Vérification des finances
//     if (finances && !Array.isArray(finances)) {
//       return res
//         .status(400)
//         .json({ error: "Le champ finances doit être un tableau." });
//     }

//     const newDepense = new Depenses({
//       amount,
//       date,
//       category,
//       description,
//       account,
//       finances,
//       company,
//     });
//     await newDepense.save();
//     return res.status(201).json(newDepense);
//   } catch (error) {
//     console.error(error);
//     return res
//       .status(500)
//       .json({ error: "Erreur serveur", details: error.message });
//   }
// };

function transformData(inputData) {
  // Create an empty result array
  const result = [];

  // Variable to store the most recent subcategory name
  let lastCategoryName = "firstname"; // Starting categoryName

  // Iterate through the input data
  inputData.forEach((item) => {
    // Set categoryName to the most recent subcategory name
    const categoryName = lastCategoryName;

    // Check if the categoryName already exists in the result array
    let category = result.find((c) => c.categoryName === categoryName);

    // If the category doesn't exist, create a new category
    if (!category) {
      category = {
        categoryName: categoryName,
        subcategories: [],
      };
      result.push(category);
    }

    // Add the current label as a subcategory under the category
    category.subcategories.push(item.label);

    // Update lastCategoryName to the current label for the next loop
    lastCategoryName = item.label;
  });

  return result;
}
const createDepense = async (req, res) => {
  try {
    const {
      amount,
      date,
      category,
      description,
      financeData,
      account,
      finances,
      company,
      type,
      selectedPath,
    } = req.body;
    console.log(req.body, "req.body");

    const credits = financeData?.credit;
    const debits = financeData?.debit;

    const creditsBody = credits.map((fin) => {
      return {
        finsubcategoryname: fin.category,
        value: fin.value,
        type: "credit",
        finsubcategory2: Array.isArray(fin.subcategory)
          ? fin.subcategory.map((sub) => sub.value)
          : [fin.subcategory.value],
      };
    });

    const filterCredits = creditsBody.filter((fin) => fin.finsubcategoryname);

    ///debits
    const debitsBody = debits.map((fin) => {
      return {
        finsubcategoryname: fin.category,
        value: fin.value,

        type: "debit",
        finsubcategory2: Array.isArray(fin.subcategory)
          ? fin.subcategory.map((sub) => sub.value)
          : [fin.subcategory.value],
      };
    });
    const filterDebits = debitsBody.filter((fin) => fin.finsubcategoryname);

    ///category logic
    console.log(selectedPath, "selectedPath");

    const categoryData = transformData(selectedPath);
    console.log(categoryData, "categoryData");

    const depense = new Depenses({
      depenseapport: type,
      amount,
      finances: [...filterCredits, ...filterDebits],
      date,
      description,
      category: categoryData,
      // account: acc,
      company,
    });
    await depense.save();

    return res.status(201).json({ success: true });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Erreur serveur", details: error.message });
  }
};

const getAllDepenses = async (req, res) => {
  try {
    const depenses = await Depenses.find();
    return res.status(200).json(depenses);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Erreur serveur", details: error.message });
  }
};

// Obtenir une seule dépense par ID
const getDepenseById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID invalide" });
    }

    const depense = await Depenses.findById(id);
    if (!depense) {
      return res.status(404).json({ message: "Dépense non trouvée" });
    }
    return res.status(200).json(depense);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Erreur serveur", details: error.message });
  }
};

// Mettre à jour une dépense
const updateDepense = async (req, res) => {
  try {
    console.log("Params reçus:", req.params); // 🔍 Vérifie les paramètres
    console.log("Body reçu:", req.body); // 🔍 Vérifie le body envoyé

    const { depenseId } = req.params;
    const updateData = req.body;

    console.log("depenseId:", depenseId);

    if (!mongoose.Types.ObjectId.isValid(depenseId)) {
      return res.status(400).json({ message: "ID de dépense invalide" });
    }

    // Vérifier que l'utilisateur ne modifie pas la structure des catégories
    if (updateData.category) {
      if (
        !Array.isArray(updateData.category) ||
        updateData.category.some(
          (cat) => !cat.categoryName || !Array.isArray(cat.subcategories)
        )
      ) {
        return res.status(400).json({
          error:
            "Chaque catégorie doit avoir un nom et une liste de sous-catégories.",
        });
      }
    }

    const updatedDepense = await Depenses.findByIdAndUpdate(
      depenseId,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedDepense) {
      return res.status(404).json({ message: "Dépense non trouvée" });
    }

    res.status(200).json(updatedDepense);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur serveur", details: error.message });
  }
};

// Supprimer une dépense par ID
const deleteDepense = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "ID invalide" });
    }

    const deletedDepense = await Depenses.findByIdAndDelete(id);
    if (!deletedDepense) {
      return res.status(404).json({ message: "Dépense non trouvée" });
    }
    return res.status(200).json({ message: "Dépense supprimée avec succès" });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Erreur serveur", details: error.message });
  }
};

const getAllcategoriesDepenses = async (req, res) => {
  try {
    const categories = await Depenses.find().distinct("category");
    return res.status(200).json(categories);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Erreur serveur", details: error.message });
  }
};
const getAllfinacesDepenses = async (req, res) => {
  try {
    const finances = await Depenses.find({}, "finances");

    res.status(200).json(finances);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Erreur serveur", details: error.message });
  }
};
const getAllAcountDepenses = async (req, res) => {
  try {
    const account = await Depenses.find({}, "account");

    res.status(200).json(account);
  } catch (error) {
    return res
      .status(500)
      .json({ error: "Erreur serveur", details: error.message });
  }
};

module.exports = {
  createDepense,
  getAllDepenses,
  getDepenseById,
  updateDepense,
  deleteDepense,
  getAportDepenses,
  getAllcategoriesDepenses,
  getAllfinacesDepenses,
  getAllAcountDepenses,
};
