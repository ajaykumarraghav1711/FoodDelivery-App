// // const express=require("express");
// // const router=express.Router();
// // const {categoryModel,validateCategory}=require("../models/category");
// // const validateAdmin=require("../middlewares/admin");
// // router.post("/create",validateAdmin,async function(req,res){
// //     let category=await categoryModel.create({
// // name:req.body.name,
// //     })

// // })
// const express = require("express");
// const router = express.Router();
// const { categoryModel, validateCategory } = require("../models/category");
// const {validateAdmin} = require("../middlewares/admin");

// router.post("/create", validateAdmin, async function (req, res) {
//     try {
//         // Validate request body
//         const { error } = validateCategory(req.body);
//         if (error) return res.status(400).json({ error: error.details[0].message });

//         // Create a new category
//         let category = await categoryModel.create({
//             name: req.body.name,
//         });

//         // Send response
//         res.status(201).json({ message: "Category created successfully", category });
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });

// module.exports = router;
 
const express = require("express");
const router = express.Router();
const { categoryModel, validateCategory } = require("../models/category");
const { validateAdmin } = require("../middlewares/admin");

router.post("/create", validateAdmin, async function (req, res) {
    try {
        // Validate request body
        const { error } = validateCategory(req.body);
        if (error) return res.status(400).json({ error: error.details[0].message });

        // Check if category already exists
        let existingCategory = await categoryModel.findOne({ name: req.body.name });
        if (existingCategory) {
            return res.status(400).json({ error: "Category already exists" });
        }

        // Create a new category
        let category = await categoryModel.create({ name: req.body.name });

        // Send response
        res.status(201).json({ message: "Category created successfully", category });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
