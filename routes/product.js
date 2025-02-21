const express=require("express");
const router=express.Router();
const {productModel,validateProduct}=require("../models/product");
const {categoryModel,validateCategory}=require("../models/category");
const upload=require("../config/multer");
const {validateAdmin,userIsLoggedIn}=require("../middlewares/admin");
const { cartModel } = require("../models/cart");
router.get("/", userIsLoggedIn,async function(req,res){
    let somethingInCart=false;
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
   let cart= await cartModel.findOne({user:req.session.passport.user});
   if(cart && cart.products.length>0) somethingInCart=true;
    let rnproducts=await productModel.aggregate([{$sample :{size:7}}]);


    const resultObject = resultArray.reduce((acc, item) => {
        acc[item.category] = item.products;
        return acc;
    }, {});
res.render("index",{products:resultObject,rnproducts,somethingInCart,cartCount: cart ?cart.products.length:0});
})

router.get("/delete/:id",validateAdmin, async function(req,res){
    if(req.user.admin){
        let prods=await productModel.findOneAndDelete({_id:req.params.id});
       return  res.redirect("/admin/products");
    }
    res.status(401).send("You are not an admin");

   
})
router.get("/delete",validateAdmin, async function(req,res){
    if(req.user.admin){
        let prods=await productModel.findOneAndDelete({_id:req.body.product_id});
       return  res.redirect("/admin/products");
    }
    res.status(401).send("You are not an admin");

   
})
router.post("/", upload.single("image"), async function(req, res) {
    if (!req.file) {
        return res.status(400).send("No file uploaded");
    }

    let { name, price, category, stock, description } = req.body;
    let image = req.file.buffer;  

    let { error } = validateProduct({ name, price, category, stock, description, image });
    if (error) {
        return res.status(400).send(error.message);
    }

  let isCategory=await categoryModel.findOne({name:category});
  if(!isCategory){
    let categoryCreated=await categoryModel.create({name:category});
  }

    let product = await productModel.create({
        name,
        price,
        category,
        stock,
        description,
        image
    });

    res.redirect(`/admin/dashboard`);
});



module.exports=router;