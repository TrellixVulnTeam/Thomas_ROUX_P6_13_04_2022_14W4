// call de mongoose
const mongoose = require('mongoose');


uniqueValidator = require('mongoose-unique-validator');
//model user

const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },

    password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator);


module.exports = mongoose.model('user', userSchema);