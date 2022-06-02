// Import sauce model
const Sauce = require('../models/sauce');
// Import fs module > interact with file system
const fs = require('fs');
const { cp } = require('fs/promises');

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
//findOne vérifie que la sauce à supprimer existe
//On vérifie que l 'utilisateur qui a créé la sauce est le même que celui authentifié *
//module fs method unlink supprime le fichier image de notre serveur *
// deleteOne supprime la sauce de la bdd 
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            if (!sauce) {
                return res.status(404).json({ error: "cette sauce n'existe pas" });
            }

            if (sauce.userId !== req.auth.userId) {
                return res.status(403).json({ error: "cette utilisateur n'a pas la permission de supprimer la sauce" });
            }

            const filename = sauce.imageUrl.split("/images/")[1];

            fs.unlink(`images/${filename}`, () => {
                // callback = notre logique delete
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: "Sauce deleted !" }))
                    .catch((error) => res.status(400).json({ error }));
            });
        })
        .catch((error) => res.status(500).json({ error }));
};


// MAJ de la sauce
// On crée un objet sauceObjet qui regarde si req.file existe ou non
// S'il existe, on traite la nouvelle image
// S'il n'existe pas, on traite l'objet entrant
// On effectue la modification
exports.updateSauce = (req, res, next) => {
    let sauceObj = {};
    if (req.file) {
        Sauce.findOne({ _id: req.params.id })
            .then((sauce) => {
                const name = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${name}`, (err) => {
                    if (err) console.log(err);
                    else {
                        console.log("ancienne photo supprimée");
                    }
                })
            })
            .catch(error => res.status(400).json({ error }));
        sauceObj = {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        };
    } else {
        sauceObj = {...req.body };
    }
    Sauce.updateOne({ _id: req.params.id }, {...sauceObj, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Objet modifié !' }))
        .catch(error => res.status(400).json({ message: error }));
};


// define likes dislike

exports.defineLikeStatus = (req, res) => {
    //  Si l'utilisateur like la sauce  
    if (req.body.like == 1) {
        Sauce.findOne({ _id: req.params.id }) // find one pour trouver la sauce 
            .then(sauce => {
                /**
                 * vérifie que l'utilsaeur n'a pas déjà like la sauce 
                 * 1- se réference a l'urray useLike 
                 * 2- update sauce data : incrémente un like + user id dans le like 
                 */
                if (sauce.usersLiked.includes(req.body.userId)) {
                    res.status(400).json({ message: 'Sauce déjà LIKED' })

                } else {
                    Sauce.updateOne({ _id: req.params.id }, { $inc: { likes: req.body.like++ }, $push: { usersLiked: req.body.userId } })
                        .then(() => res.status(200).json({ message: "Tu as liké cette sauce!" + req.body.userId }))
                        .catch((error) => res.status(400).json({ error }))
                }
            })
    }

    //   si l'utilisateur dislikes la sauce  
    else if (req.body.like == -1) {
        Sauce.findOne({ _id: req.params.id })
            .then(sauce => {

                if (sauce.usersDisliked.includes(req.body.userId)) {
                    res.status(400).json({ message: 'Sauce déjà DISLIKED' })
                } else {

                    Sauce.updateOne({ _id: req.params.id }, { $inc: { dislikes: Math.abs(req.body.like++) }, $push: { usersDisliked: req.body.userId } })
                        .then(() => res.status(200).json({ message: "tu n'aimes pas cette sauce!" }))
                        .catch((error) => res.status(400).json({ error }))
                }
            })
    }

    //  Si l'utilisateur anule son like/dislike  
    else if (req.body.like == 0) {
        Sauce.findOne({ _id: req.params.id })
            .then(sauce => {
                // cas d'anulation du like
                if (sauce.usersLiked.includes(req.body.userId)) {

                    Sauce.updateOne({ _id: req.params.id }, { $inc: { likes: req.body.like - 1 }, $pull: { usersLiked: req.body.userId } })
                        .then(() => res.status(200).json({ message: "Tu as changé d'avis sur cette sauce!" }))
                        .catch((error) => res.status(400).json({ error }))
                } // anulation du dislike 
                else if (sauce.usersDisliked.includes(req.body.userId)) {

                    Sauce.updateOne({ _id: req.params.id }, { $inc: { dislikes: req.body.like - 1 }, $pull: { usersDisliked: req.body.userId } })
                        .then(() => res.status(200).json({ message: "Tu as changé d'avis sur cette sauce!" }))
                        .catch((error) => res.status(400).json({ error }))
                }
            })
    }
};