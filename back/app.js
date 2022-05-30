// import de express
const express = require('express');
// import de mongoose 
const mongoose = require('mongoose');
//Sécurisation des requêtes - modifie headers
const helmet = require("helmet");
// Import Node 'path' module > give access to the path of our file system
const path = require('path');
// import route 
const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce');





// mongoose
mongoose.connect('mongodb+srv://ThomasROUX:projetopc@cluster0.y1lbb.mongodb.net/?retryWrites=true&w=majority', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

// Lancement de Express
const app = express();
app.use(express.json());
// permet de gérer les erreurs de connexion sur plusieurs serveurs (CORS)
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.use(helmet({
    crossOriginResourcePolicy: false,
}));


//fichier image pour le middleware 
app.use('/images', express.static(path.join(__dirname, 'images')))

//utilisation des  route sauces 
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);






module.exports = app;