// import models auth
const User = require('../models/user');
//import package bcrypt 
const bcrypt = require('bcrypt');
// toekn import 
const jwt = require('jsonwebtoken');




// middleware
exports.signup = (req, res, next) => {
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            });
            user.save()
                .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
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