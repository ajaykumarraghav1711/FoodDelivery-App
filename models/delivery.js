const mongoose = require("mongoose");
const Joi = require("joi");

// Mongoose Schema with validation
const deliverySchema = new mongoose.Schema({
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "order",
        required: true
    },
    deliveryBoy: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    status: {
        type: String,
        enum: ["pending", "in-transit", "delivered", "cancelled"],
        default: "pending",
        required: true
    },
    trackingURL: {
        type: String,
        match: /^https?:\/\/.+$/,
        required: true
    },
    estimatedDeliveryTime: {
        type: Number,
        min: 0,
        required: true
    }
});

// Joi validation function
function validateDelivery(delivery) {
    const schema = Joi.object({
        order: Joi.string().required(),
        deliveryBoy: Joi.string().min(3).max(50).required(),
        status: Joi.string().valid("pending", "in-transit", "delivered", "cancelled").required(),
        trackingURL: Joi.string().uri().required(),
        estimatedDeliveryTime: Joi.number().min(0).required()
    });

    return schema.validate(delivery);
}

module.exports = {
    deliveryModel: mongoose.model("deliver", deliverySchema),
    validateDelivery
};
