const mongoose = require("mongoose");
const Joi = require("joi");

// Mongoose Schema with validation
const orderSchema = new mongoose.Schema({
   orderId:{
type:String,
required:true
   },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    products: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "product",
            required: true
        }
    ],
    totalPrice: {
        type: Number,
        required: true,
        min: 0
    },
    address: {
        type: String,
        required: true,
        minlength: 5
    },
    status: {
        type: String,
        enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
        default: "pending",
        required: true
    },
    payment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "payment",
        required: true
    },
    delivery: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "delivery"
    }
});

// Joi validation function
function validateOrder(order) {
    const schema = Joi.object({
        user: Joi.string().required(),
        products: Joi.array().items(Joi.string().required()).min(1).required(),
        totalPrice: Joi.number().min(0).required(),
        address: Joi.string().min(5).required(),
        status: Joi.string().valid("pending", "confirmed", "shipped", "delivered", "cancelled").required(),
        payment: Joi.string().required(),
        delivery: Joi.string().optional()
    });

    return schema.validate(order);
}

module.exports = {
    orderModel: mongoose.model("order", orderSchema),
    validateOrder
};