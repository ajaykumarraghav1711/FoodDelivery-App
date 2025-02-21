 const express = require("express");
const router = express.Router();
const { cartModel, validateCart } = require("../models/cart");
const { validateAdmin, userIsLoggedIn } = require("../middlewares/admin");
const {productModel} = require("../models/product");
const mongoose = require("mongoose");

router.get("/", userIsLoggedIn, async function (req, res) {
    try {
        let cart = await cartModel.findOne({ user: req.session.passport.user }).populate("products");
        if (!cart) return res.render("cart", { cart: [], finalprice: 0, userid: req.session.passport.user });

        let cartDataStructure = {}; // Correctly initializing

        cart.products.forEach((product) => {
            let key = product._id.toString();
            if (cartDataStructure[key]) {
                cartDataStructure[key].quantity += 1;
            } else {
                cartDataStructure[key] = {
                    ...product._doc,
                    quantity: 1, // Adding quantity
                };
            }
        });

        let finalArray = Object.values(cartDataStructure);
        let finalprice = cart.totalPrice + 20;
        res.render("cart", { cart: finalArray, finalprice: finalprice, userid: req.session.passport.user });

    } catch (err) {
        res.send(err.message);
    }
});

router.get("/add/:id", userIsLoggedIn, async function (req, res) {
    try {
        let cart = await cartModel.findOne({ user: req.session.passport.user });
        let product = await productModel.findOne({ _id: req.params.id });

        if (!cart) {
            cart = await cartModel.create({
                user: req.session.passport.user,
                products: [req.params.id],
                totalPrice: Number(product.price),
            });
        } else {
            cart.products.push(req.params.id);
            cart.totalPrice = cart.totalPrice + Number(product.price);
            await cart.save();
        }
        res.redirect(req.get("Referrer") || "/");


    } catch (err) {
        res.send(err.message);
    }
});
router.get('/cart', async (req, res) => {
    try {
        const cart = await Cart.find({ user: req.user._id }).populate('items.product');
        
        // Ensure preCheckoutItems is defined, even if empty
        const preCheckoutItems = await Product.find({ recommended: true }).limit(5); 

        res.render('cart', {
            cart: cart.items || [],
            preCheckoutItems: preCheckoutItems || [],  // Ensure it's always an array
            userid: req.user._id
        });
    } catch (error) {
        console.error("Error fetching cart:", error);
        res.status(500).send("Internal Server Error");
    }
});


router.get("/remove/:id", userIsLoggedIn, async function (req, res) {
    try {
        let cart = await cartModel.findOne({ user: req.session.passport.user });
        if (!cart) return res.send("Something went wrong while removing products.");

        let product = await productModel.findOne({ _id: req.params.id }); // Fix: Fetch product

        let prodIndex = cart.products.indexOf(req.params.id);
        if (prodIndex !== -1) {
            cart.products.splice(prodIndex, 1);
            cart.totalPrice -= Number(product.price);
            await cart.save();
        }
        res.redirect(req.get("Referrer") || "/");


    } catch (err) {
        res.send(err.message);
    }
});
router.get("/delivery",function(req,res){
    alert("Order reached in 10 minutes");
    
})

module.exports = router;

