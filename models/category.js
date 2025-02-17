const mongoose = require("mongoose");
const Joi = require("joi");

// Mongoose Schema with validation
const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        minlength: 3,
        maxlength: 50
    }
});

// Joi validation function
function validateCategory(category) {
    const schema = Joi.object({
        name: Joi.string().min(3).max(50).required()
    });

    return schema.validate(category);
}

module.exports = {
    categoryModel: mongoose.model("category", categorySchema),
    validateCategory
};