const Depenses = require('../models/Depenses');
const mongoose = require('mongoose');

const getTypeFinSubcategory2 = async (req, res) => {
    try {
        const { depenseId, company, finsubcategory1 } = req.body;

        if (!mongoose.Types.ObjectId.isValid(depenseId) || !mongoose.Types.ObjectId.isValid(company)) {
            return res.status(400).json({ message: "Invalid depenseId or company ID" });
        }

        const depense = await Depenses.findOne({
            _id: depenseId,
            company: company,
            "finances.finsubcategory1": finsubcategory1
        });

        if (!depense) {
            return res.status(404).json({ message: "Dépense non trouvée" });
        }

        // Extraction de typefinsubcategory2
        const typeFinSubcategory2 = depense.finances
            .filter(finance => finance.finsubcategory1 === finsubcategory1)
            .flatMap(finance => finance.finsubcategory2.typefinsubcategory2);

        res.status(200).json({ typefinsubcategory2: typeFinSubcategory2 });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

module.exports = { getTypeFinSubcategory2 };
