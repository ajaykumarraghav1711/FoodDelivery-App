// const express=require("express");
// const router=express.Router();
// require("dotenv").config();
// const {paymentModel}=require("../models/payment");

// const Razorpay=require("razorpay");

// const { validatePaymentVerification } = require("razorpay/dist/utils/razorpay-utils");
// const  razorpay=new Razorpay({
//     key_id:process.env.RAZORPAY_KEY_ID,
//     key_secret:process.env.RAZORPAY_KEY_SECRET
// });

//  router.post("/create/orderId",async (req,res)=>{
//     const options={
//         amount:5000*100,
//         currency:"INR",
//     };
//     try{
//         const order=await razorpay.orders.create(options);
//         res.send(order);
//         const newPayment=await paymentModel.create({
//             orderId:order.id,
             
//             amount:order.amount,
//             currency:order.currency,
//             status: "pending",
//         })
//     }
//     catch(error){
//         res.status(500).send("Error creating Order");
//     }
//  })
//  router.post("/api/payment/verify",async (req,res)=>{
//     const {razorpayOrderId,razorpaypayPaymentId,signature}=req.body;
//     const secret=process.env.RAZORPAY_KEY_SECRET ;
//     try{
//         const{validatePaymentVerification,
//         }=require("../node_modules/razorpay/dist/utils/razorpay-utils");
//         const result=validatePaymentVerification({
//             order_id:razorpayOrderId,payment_id:razorpaypayPaymentId
//         },signature,secret);
//         if(result){
//             const payment=await paymentModel.findOne({orderId:razorpayOrderId});
//             payment.paymentId=razorpayOrderId;
//             payment.signature=signature;
//             payment.status="completed";
//             await payment.save();
//              res.json({status:success});
//         }
//         else{
//             res.status(400).send("Invalid Signature");
//         }
//     }
//     catch(error){
//         console.log(error);
//         res.status(500).send("error verifying payment");
//     }
//  })
//  module.exports=router;

const express = require("express");
const router = express.Router();
require("dotenv").config();
const { paymentModel } = require("../models/payment");
const Razorpay = require("razorpay");
const { validatePaymentVerification } = require("razorpay/dist/utils/razorpay-utils");

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create Razorpay Order
router.post("/create/orderId", async (req, res) => {
    const options = {
        amount: 5000 * 100, // Amount in paise
        currency: "INR",
        receipt: `receipt_${Date.now()}`, // Unique receipt ID
    };

    try {
        const order = await razorpay.orders.create(options);

        res.send(order);
        const newPayment=await paymentModel.create({
            orderId:order.id,
            amount:order.amount,
            currency:order.currency,
            status:"pending",
            

        })
    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).send("Error creating Order");
    }
});

// Verify Payment
router.post("/api/payment/verify", async (req, res) => {
    const { razorpayOrderId, razorpayPaymentId, signature } = req.body;
    const secret = process.env.RAZORPAY_KEY_SECRET;

    try {
        const isValid = validatePaymentVerification(
            { order_id: razorpayOrderId, payment_id: razorpayPaymentId },
            signature,
            secret
        );

        if (isValid) {
            const payment = await paymentModel.findOne({ orderId: razorpayOrderId });

            if (!payment) {
                return res.status(404).send("Payment record not found");
            }

            // Update payment details in the database
            payment.paymentId = razorpayPaymentId;
            payment.signature = signature;
            payment.status = "completed";
            await payment.save();

            res.json({ status: "success" });
        } else {
            res.status(400).send("Invalid Signature");
        }
    } catch (error) {
        console.error("Error verifying payment:", error);
        res.status(500).send("Error verifying payment");
    }
});

module.exports = router;
