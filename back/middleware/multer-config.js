// middleware pour l'upload des images 
//import multer
const multer = require('multer');
//type de fichier autoriser 
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images');
    },
    filename: (req, file, callback) => {
        // création file name 
        const name = file.originalname.split(' ').join('_');
        //création de l'extension du fichier sur le mone type
        const extension = MIME_TYPES[file.mimetype];
        // génération du fichier
        callback(null, name + Date.now() + '.' + extension);
    }
});
// exportation du multer
module.exports = multer({ storage: storage }).single('image');