/***Création modèle sauce***/
const mongoose = require('mongoose');
// gestionnaire erreur 
var mongodbErrorHandler = require('mongoose-mongodb-errors')
mongoose.plugin(mongodbErrorHandler);

const sauceSchema = mongoose.Schema({

    userId: { type: String, required: true }, //'identifiant MongoDB unique de l'utilisateur qui a créé la sauce
    name: { type: String, required: true }, //nom de la sauce
    manufacturer: { type: String, required: true }, //fabricant de la sauce
    description: { type: String, required: true }, //description de la sauce
    mainPepper: { type: String, required: true }, // le principal ingrédient épicé de la sauce
    imageUrl: { type: String, required: true }, // l'URL de l'image de la sauce téléchargée par l'utilisateur
    heat: { type: Number, required: true }, //nombre entre 1 et 10 décrivant la sauce
    likes: { type: Number, default: 0 }, //nombre d'utilisateurs qui aiment  la sauce
    dislikes: { type: Number, default: 0 }, //nombre d'utilisateurs qui n'aiment pas la sauce
    usersLiked: { type: [String] }, // tableau des identifiants des utilisateurs  qui ont aimé la sauce
    usersDisliked: { type: [String] }, //tableau des identifiants des utilisateurs qui n'ont pas aimé  la sauce


})


module.exports = mongoose.model('sauce', sauceSchema);