const mongoose = require("mongoose");
const Joi = require("joi");

// Mongoose Schema with validation
const AddressSchema = new mongoose.Schema({
    state: {
        type: String,
        required: true
    },
    Zip: {
        type: Number,
        required: true,
        min: 100000,  
        max: 999999,
    },
    city: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true,
        minlength: 5
    }
});

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 100
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    password: {
        type: String,
      
        minlength: 6
    },
    phone: {
        type: Number,
         
    },
    address: [AddressSchema]
}, { timestamps: true });

// Joi validation function
function validateUser(user) {
    const addressSchema = Joi.object({
        state: Joi.string().required(),
        Zip: Joi.number().min(10000).max(99999).required(),
        city: Joi.string().required(),
        address: Joi.string().min(5).required()
    });

    const schema = Joi.object({
        name: Joi.string().min(3).max(100).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        phone: Joi.number().required(),
        address: Joi.array().items(addressSchema).optional()
    });

    return schema.validate(user);
}

module.exports = {
    userModel: mongoose.model("User", userSchema),
    validateUser,
};
