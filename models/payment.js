const mongoose = require("mongoose");
const Joi = require("joi");
 
const paymentSchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: true,
        unique: true,  
        index: true,   
    },
    paymentId: {
        type: String,
        
    },
    signature: {
        type: String,
         

    },
    amount: {
        type: Number,
        required: true,
    },
    currency: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        default: "pending",
        enum: ["pending", "completed", "failed"], // Enforce valid statuses
    },
}, { timestamps: true });

module.exports = {
    paymentModel: mongoose.model("Payment", paymentSchema),
};
