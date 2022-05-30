const express = require("express");
const router = express.Router();
const validPassword = require('../middlewares/valid-password')

const userCtrl = require('../controllers/user');

router.post('/signup', validPassword, userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;