// Import Express 
const express = require('express');
// création du router 
const router = express.Router();
// Import controller
const sauceCtrl = require('../controllers/sauce');
// import middleware authorization
const auth = require('../middleware/auth');
//import mutler 
const multer = require('../middleware/multer-config');


// -- Create routes --


//Récupération de toutes les sauces
router.get('/', auth, sauceCtrl.getAllSauces);
//Récupération d'une sauce par son ID
router.get('/:id', auth, sauceCtrl.getOneSauce);
//Ajout d'une sauce
router.post('/', auth, multer, sauceCtrl.createSauce);
//Modification  d'une sauce
router.put('/:id', auth, multer, sauceCtrl.updateSauce);
//Suppression d'une sauce
router.delete('/:id', auth, sauceCtrl.deleteSauce);
//Modification des likes
router.post('/:id/like', auth, sauceCtrl.defineLikeStatus);



module.exports = router;