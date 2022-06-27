const joi = require("joi");

//SCHEMA JOI QUI PERMET DE VERIFIER L'EMAIL ET LE PASSWORD DE L'UTILISATEUR COTÉ BACKEND
module.exports = joi.object().keys({
    email: joi.string().email().required(),
    password: joi
        .string()
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/)

        .required()
        .messages({
            'string.regex': 'Mot de passe trop faible, minimum 8 caractères, dont 1 majuscule, 1 minuscule, 1 nombre et 1 caractère spécial'

        })
});