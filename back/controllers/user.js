const mongoose = require('mongoose');
var mongodbErrorHandler = require('mongoose-mongodb-errors')
mongoose.plugin(mongodbErrorHandler);
// import models auth
const User = require('../models/user');
//import package bcrypt 
const bcrypt = require('bcrypt');
// toekn import 
const jwt = require('jsonwebtoken');
// import vérification md/mail
const schemaJoi = require("../middleware/joi");


// middleware
exports.signup = (req, res, next) => {
    const resultSchema = schemaJoi.validate(req.body);
    console.log(resultSchema);

    console.log(resultSchema.details)
    if (!resultSchema.error) {

        //Si le mail/mdp correspond au schema  l compte est créer 
        bcrypt
            .hash(resultSchema.value.password, 10)
            .then((hash) => {
                const user = new User({
                    email: resultSchema.value.email,
                    password: hash,
                });

                user
                    .save()
                    .then(() => res.status(201).json({ message: "utilisateur créé !" }))
                    .catch((error) => res.status(400).json(error));
            })

        .catch((error) => res.status(500).json({ error }));
    } else {
        //message d'erreur si condition mdp non respecter 
        return res.status(422).send({
            errorMsg: 'Mot de passe trop faible, minimum 8 caractères, dont 1 majuscule, 1 minuscule, 1 nombre et 1 caractère spécial'
        })

    }
};
// vérification pour login 
exports.login = (req, res, next) => {
    // récupération du mail avec findOne
    User.findOne({ email: req.body.email })
        .then(user => {
            // si on ne le trouve pas on return utilisateur non trouvé 
            if (!user) {
                return res.status(401).json({ error: 'Utilisateur non trouvé !' });
            }
            // sinon on utilise bcrypt pour comparer le  hach MDP entrée a celui de la BDD 
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    // si il n'est pas bon on retourne une erreur 
                    if (!valid) {
                        return res.status(401).json({ error: 'Mot de passe incorrect !' });
                    }
                    // si le hach est bon on renvoie le user id et un token 
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign({ userId: user._id },
                            'RANDOM_TOKEN_SECRET', { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};