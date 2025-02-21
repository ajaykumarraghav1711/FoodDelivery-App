 

// const express = require("express");
// const router = express.Router();
// require("../config/mongoose");
// require("dotenv").config();
// const { paymentModel } = require("../models/payment");
// const Razorpay = require("razorpay");
// const { validatePaymentVerification } = require("razorpay/dist/utils/razorpay-utils");

// const razorpay = new Razorpay({
//     key_id: process.env.RAZORPAY_KEY_ID,
//     key_secret: process.env.RAZORPAY_KEY_SECRET
// });

 
// router.post("/create/orderId", async (req, res) => {
//     const options = {
//         amount: 5000 * 100, 
//         currency: "INR",
//         receipt: `receipt_${Date.now()}`, // Unique receipt ID
//     };

//     try {
//         const order = await razorpay.orders.create(options);
        
//         // Save payment details in DB
//         const newPayment = await paymentModel.create({
//             orderId: order.id,
//             amount: order.amount,
//             currency: order.currency,
//             status: "pending",
          
//         });

//         res.status(201).json({ order, payment: newPayment });

//     } catch (error) {
//         console.error("Error creating order:", error);
//         res.status(500).json({ error: "Error creating order" });
//     }
// });



// router.post("/api/payment/verify", async (req, res) => {
//     const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body; // Correct keys
//     const secret = process.env.RAZORPAY_KEY_SECRET;

//     try {
//         const isValid = validatePaymentVerification(
//             { order_id: razorpay_order_id, payment_id: razorpay_payment_id },
//             razorpay_signature,
//             secret
//         );

//         if (isValid) {
//             const payment = await paymentModel.findOne({ orderId: razorpay_order_id });

//             if (!payment) {
//                 return res.status(404).json({ error: "Payment record not found" });
//             }
 
//             payment.paymentId = razorpay_payment_id;
//             payment.signature = razorpay_signature;
//             payment.status = "completed";
//             await payment.save();

//             res.json({ status: "success", payment });
//         } else {
//             res.status(400).json({ error: "Invalid Signature" });
//         }
//     } catch (error) {
//         console.error("Error verifying payment:", error);
//         res.status(500).json({ error: "Error verifying payment" });
//     }
// });


// module.exports = router;

const express = require("express");
const router = express.Router();
require("../config/mongoose");
require("dotenv").config();
const { paymentModel } = require("../models/payment");
const Razorpay = require("razorpay");
const { validatePaymentVerification } = require("razorpay/dist/utils/razorpay-utils");

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create Order Route
router.post("/create/orderId", async (req, res) => {
    const options = {
        amount: 5000 * 100, 
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
    };

    try {
        const order = await razorpay.orders.create(options);
        
        // Save only order details (without signature)
        const newPayment = await paymentModel.create({
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            status: "pending",
        });

        res.status(201).json({ order, payment: newPayment });
    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({ error: "Error creating order" });
    }
});

// Payment Verification Route
router.post("/api/payment/verify", async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const secret = process.env.RAZORPAY_KEY_SECRET;

    try {
        const isValid = validatePaymentVerification(
            { order_id: razorpay_order_id, payment_id: razorpay_payment_id },
            razorpay_signature,
            secret
        );

        if (isValid) {
            const payment = await paymentModel.findOne({ orderId: razorpay_order_id });

            if (!payment) {
                return res.status(404).json({ error: "Payment record not found" });
            }

            // Save paymentId and signature after successful payment
            payment.paymentId = razorpay_payment_id;
            payment.signature = razorpay_signature;
            payment.status = "completed";
            await payment.save();

            res.json({ status: "success", payment });
        } else {
            res.status(400).json({ error: "Invalid Signature" });
        }
    } catch (error) {
        console.error("Error verifying payment:", error);
        res.status(500).json({ error: "Error verifying payment" });
    }
});

module.exports = router;
