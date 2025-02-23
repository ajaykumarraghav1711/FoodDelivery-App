const express = require("express");
const router = express.Router();
const { paymentModel } = require("../models/payment");
const { orderModel } = require("../models/order");
const { userModel } = require("../models/user");
const { cartModel } = require("../models/cart");
require("../config/mongoose");

router.get("/:userid/:orderid/:paymentid/:signature", async function (req, res) {
    try {
        let paymentDetails = await paymentModel.findOne({
            orderId: req.params.orderid,
        });

        if (!paymentDetails) {
            return res.status(404).send("Payment details not found");
        }

        if (req.params.signature === paymentDetails.signature && req.params.paymentid === paymentDetails.paymentId) {
            let cart = await cartModel.findOne({ user: req.params.userid });

            if (!cart) {
                return res.status(404).send("Cart not found");
            }

            let newOrder = await orderModel.create({
                orderId: req.params.orderid,
                user: req.params.userid,
                products: cart.products || [],
                totalPrice: cart.totalprice || 0,
                status: "processing",
                payment: paymentDetails._id,
            });

            // Store order ID in session to use in confirm page
            req.session.orderId = newOrder.orderId;

            res.render("confirm", { orderId: req.params.orderid });

       
            await cartModel.deleteOne({ user: req.params.userid });

        } else {
            return res.status(401).send("Invalid signature or payment ID");
        }
    } catch (error) {
        console.error("Error processing order:", error);
        res.status(500).send("Internal Server Error");
    }
});

router.post("/address/:orderid", async function (req, res) {
    try {
        let order = await orderModel.findOne({ orderId: req.params.orderid });

        if (!order) {
            return res.status(404).send("Order not found");
        }
        if (!req.body.address) {
            return res.status(400).send("Address is required");
        }

        order.address = req.body.address;
        await order.save();

        res.render("confirm", { orderId: req.params.orderid });

    } catch (error) {
        console.error("Error updating address:", error);
        res.status(500).send("Internal Server Error");
    }
});

router.get('/map', async (req, res) => {
    try {
        let orderId = req.session.orderId;
        if (!orderId) return res.status(400).send("Order ID not found in session");

        res.render('map', { orderId });

        // Clear cart after rendering confirm page
        await cartModel.deleteMany({ user: req.session.userId });
        
    } catch (error) {
        console.error("Error clearing cart:", error);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;

