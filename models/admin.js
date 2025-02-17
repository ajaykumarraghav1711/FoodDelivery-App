const mongoose = require("mongoose");
const Joi = require("joi");

 
const adminSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ // Email format validation
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    }
});

// Joi validation function
function validateAdmin(admin) {
    const schema = Joi.object({
        name: Joi.string().min(3).max(50).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required()
    });

    return schema.validate(admin);
}

module.exports = {
    adminModel: mongoose.model("admin", adminSchema),
    validateAdmin
};
