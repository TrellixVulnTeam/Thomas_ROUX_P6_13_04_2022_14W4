const express = require('express');
const mongoose = require('mongoose');

// Import Node 'path' module > give access to the path of our file system
const path = require('path');
// import route 
const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce');

console.log(sauceRoutes);
console.log(userRoutes);

// mongoose
mongoose.connect('mongodb+srv://ThomasRoux:<password>@cluster0.lyz1i.mongodb.net/Cluster0?retryWrites=true&w=majority', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

// Lancement de Express
const app = express();

// requete response
app.use((req, res, next) => {
    res.json({ message: 'Votre requête a bien été reçue !' });
});


//middleware 
// Configuration cors
// app.use((req, res, next) => {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
//     res.setHeader('Access-Control-Allow-Credentials', true);
//     next();
// });

// permet de gérer les erreurs de connexion sur plusieurs serveurs (CORS)
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
    next();
});



//fichier image pour le middleware 
app.use('/images', express.static(path.join(__dirname, 'images')))

//utilisation des  route sauces 
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);



app.use(express.json());


module.exports = app;