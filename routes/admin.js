const express=require("express");
const router =express.Router();
const {adminModel}=require("../models/admin");
const {productModel}=require("../models/product");
const{ categoryModel}=require("../models/category")

const bcrypt=require("bcrypt");
const jwt = require('jsonwebtoken');
const user = require("../models/user");
const {validateAdmin,userIsLoggedIn}=require("../middlewares/admin");
require("dotenv").config();
if(typeof process.env.NODE_ENV!="undefined" &&process.env.NODE_ENV=="development"){
    router.get("/create",async function(req,res){
        try{

       
let salt=await bcrypt.genSalt(10);
let hashedPassword=await bcrypt.hash("password",salt);
let user=new adminModel({
    name:"admin",
    email:"admin@gmail.com",

    password:hashedPassword,
    role:"admin"
})
await user.save();
let token=jwt.sign({email:"admin@gmail.com",admin:true},process.env.JWT_KEY);
res.cookie("token",token);
res.send("admin created succesfully");
}
catch(err){
  res.send(err.message);
}

    })
    router.get("/login",function(req,res){
        res.render("admin_login");
    })
    router.get("/create", async function(req, res) {
        try {
            let existingAdmin = await adminModel.findOne({ email: "admin@gmail.com" });
            if (existingAdmin) {
                return res.send("Admin already exists.");
            }
    
            let salt = await bcrypt.genSalt(10);
            let hashedPassword = await bcrypt.hash("password", salt);
    
            let user = new adminModel({
                name: "admin",
                email: "admin@gmail.com",
                password: hashedPassword,
                role: "admin"
            });
    
            await user.save();
            let token = jwt.sign({ email: "admin@gmail.com", admin: true }, process.env.JWT_KEY);
            res.cookie("token", token);
            res.send("Admin created successfully.");
        } catch (err) {
            res.send(err.message);
        }
    });
    
    router.post("/login",async function(req,res){
     
        let email=req.body.email;
        let password=req.body.password;
        let admin=await adminModel.findOne({email:email});
        if(!admin){
            return res.send("admin not found");

        }
        if(admin){
            let isMatch=await bcrypt.compare(password,admin.password);
            if(!isMatch){
                return res.send("invalid password");
            }
            if(isMatch){
                let token=jwt.sign({email:email,admin:true},process.env.JWT_KEY);
                res.cookie("token",token);
                res.send("admin logged in succesfully");
            }

        }
    })
    router.get("/dashboard", validateAdmin, async function(req,res){

         let prodcount=await productModel.countDocuments();
         let categcount=await categoryModel.countDocuments();

      res.render("admin_dashboard", { products: {}, prodcount, categcount });

    })
    // router.get("/products", validateAdmin, async function(req, res) {
    //     const resultArray = await productModel.aggregate([
    //         {
    //             $group: {
    //                 _id: "$category",
    //                 products: { $push: "$$ROOT" }
    //             }
    //         },
    //         {
    //             $project: {
    //                 _id: 0,
    //                 category: "$_id",
    //                 products: { $slice: ["$products", 10] }
    //             }
    //         }
    //     ]);
    
    //     const resultObject = resultArray.reduce((acc, item) => {
    //         acc[item.category] = item.products;
    //         return acc;
    //     }, {});
    
    //     res.render("admin_products", { products: resultObject });
    // });
    router.get("/products", validateAdmin, async function(req, res) {
        try {
            const resultArray = await productModel.aggregate([
                {
                    $group: {
                        _id: "$category",
                        products: { $push: "$$ROOT" }
                    }
                },
                {
                    $project: {
                        _id: 0,
                        category: "$_id",
                        products: { $slice: ["$products", 10] }
                    }
                }
            ]);
    
            // Convert the array into an object with category names as keys
            const resultObject = resultArray.reduce((acc, item) => {
                acc[item.category] = item.products;
                return acc;
            }, {});
    
            console.log("🚀 Products Data Sent to EJS:", resultObject); // Debugging log
            res.render("admin_products", { products: resultObject });
        } catch (error) {
            console.error("Error fetching products:", error);
            res.status(500).send("Internal Server Error");
        }
    });
    
    router.get("/logout",function(req,res){
        res.clearCookie("token");
        res.redirect("/admin/login");
    })
}
module.exports=router;