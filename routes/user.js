const express=require("express");
const mongoose = require("mongoose");
const router=express.Router();
const {userModel,validateUser}=require("../models/user");
router.get("/login",function(req,res){
    res.render("user_login");
})
router.get("/logout",function(req,res,next){
    req.logout(function(err) {
        if (err) { return next(err); }
        req.session.destroy((err)=>{
            if(err) return next(err);
            res.clearCookie("connect.sid");

            res.redirect('/users/login');
        })
      
      });
    
})
module.exports=router;

