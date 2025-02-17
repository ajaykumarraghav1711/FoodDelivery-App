const mongoose = require("mongoose");
const Joi = require("joi");

 
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 100
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        maxlength: 500
    },
    image: {
        type: Buffer,
        required: true
    }
});

 
function validateProduct(product) {
    const schema = Joi.object({
        name: Joi.string().min(3).max(100).required(),
        price: Joi.number().min(0).required(),
        category: Joi.string().required(),
        stock: Joi.number().required(),
        description: Joi.string().max(500).optional(),
        image: Joi.any().required() 
   

    });

    return schema.validate(product);
}

module.exports = {
    productModel: mongoose.model("product", productSchema),
    validateProduct
};
