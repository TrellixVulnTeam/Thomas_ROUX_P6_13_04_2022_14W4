// Import sauce model
const Sauce = require('../models/sauce')

// Import fs module > interact with file system
const fs = require('fs');

// créate sauce
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete req.body._id;
    const sauce = new Sauce({
        ...sauceObject,
        // générer l'url de l'image 
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: [],

    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'Sauce enregistré !' }))
        .catch(error => res.status(400).json({ error }));
};
// voir toutes les sauces
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};

// chercher une sauce par ID
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => res.status(200).json(sauce))
        .catch((error) => res.status(404).json({ error }));
};

// chercher une sauce 
exports.deleteSauce = (req, res, next) => {
    // recherche de l'objet dans la base de donnée 
    Sauce.findOne({ _id: req.params.id })
        // une fois trouvé on extrait le nom du fichier a supprimer 
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];
            // utiisation fs.unlink() pour supprimer le ficher grace au nom récupérer 
            fs.unlink(`images/${filename}`, () => {
                // puis suppresion dans la base 
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Sauce supprimée !' }))
                    .catch(error => res.status(400).json({ error }));
            });
        })
        .catch(error => res.status(500).json({ error }));
};

// MAJ de la sauce
exports.updateSauce = (req, res, next) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.thing),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {...req.body };
    Sauce.updateOne({ _id: req.params.id }, {...sauceObject, _id: req.params.id }) // update sauce (match id)
        .then(() => res.status(200).json({ message: 'Sauce mise à jour !' }))
        .catch(error => res.status(400).json({ error }))
};




// define likes dislike
exports.defineLikeStatus = (req, res) => {
    //--- si l'utilisateur like == 1 ------ //
    if (req.body.like == 1) {

        Sauce.findOne({ _id: req.params.id })
    }
};