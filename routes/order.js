const express=require("express");
const router=express.Router();
const {paymentModedel}=require("../models/payment");
const {orderModel}=require("../models/order");
router.get("/:userid/:orderid/:paymentid/:signature",async function(req,res){
let paymentDetails=await paymentModel.findOne({
    orderid:req.params.orderid,
});
if(!paymentDetails){
    return res.status(404).send("Payment details not found");
}
if(req.params.signature===paymentDetails.signature && req.params.paymentid===paymentDetails.paymentId){
    let cart=await cartModel.findOne({user:req.params.userid});
    await orderModel.create({
        orderId:req.params.orderid,
        user:req.params.userid,
        products:cart.products,
        totalPrice:cart.totalprice,
        status:"processing",
        payment:paymentDetails._id,


    });

     res.redirect(`/map/${req.params.orderid}`);
}
else{
    return res.status(401).send("Invalid signature or payment id");
}
})
router.post("/address/:orderid",async function(req,res){
    let order=await orderModel.findOne({orderId:req.params.orderid});
    if(!order){
        return res.status(404).send("Order not found");
    }
    if(!req.body.address){
        return res.status(400).send("Address is required");
    }
    order.address=req.body.address;
    order.save();
})
module.exports=router;