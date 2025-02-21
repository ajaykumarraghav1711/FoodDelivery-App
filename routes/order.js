
const express = require("express");
const router = express.Router();
const { paymentModel } = require("../models/payment");
const { orderModel } = require("../models/order");
const { userModel } = require("../models/user");
const { cartModel } = require("../models/cart");
require("../config/mongoose");

router.get("/:userid/:orderid/:paymentid/:signature", async function (req, res) {
 

    let paymentDetails = await paymentModel.findOne({
        orderId: req.params.orderid, // Fix: Correct parameter case
    });

    if (!paymentDetails) {
        return res.status(404).send("Payment details not found");
    }

    if (req.params.signature === paymentDetails.signature && req.params.paymentid === paymentDetails.paymentId) {
        let cart = await cartModel.findOne({ user: req.params.userid });

        if (!cart) {
            return res.status(404).send("Cart not found");
        }

        await orderModel.create({
            orderId: req.params.orderid,
            user: req.params.userid,
            products: cart.products || [], // Fix: Handle empty cart
            totalPrice: cart.totalprice || 0, // Fix: Handle missing price
            status: "processing",
            payment: paymentDetails._id,
        });

        res.render("map", { orderId: req.params.orderid });

    } else {
        return res.status(401).send("Invalid signature or payment ID");
    }
});


router.post("/address/:orderid", async function (req, res) {
    let order = await orderModel.findOne({ orderId: req.params.orderid });

    console.log(order);

    if (!order) {
        return res.status(404).send("Order not found");
    }
    if (!req.body.address) {
        return res.status(400).send("Address is required");
    }

    order.address = req.body.address;
   
     
    await order.save();  

    res.status(200).json({ message: "Address updated", order });
});


module.exports = router;
