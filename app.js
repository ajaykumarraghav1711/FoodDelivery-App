const express=require("express");
const app=express();

const path=require("path");

const passport=require("passport");
const indexRouter=require("./routes");
 const authRouter=require("./routes/auth");
 const categoriesRouter=require("./routes/category");
 const adminRouter=require("./routes/admin");
 const productRouter=require("./routes/product");
 const userRouter=require("./routes/user");
 const cartRouter=require("./routes/cart");
 const orderRouter=require("./routes/order")
 const paymentRouter = require("./routes/payment");
const cookieParser=require("cookie-parser");

 
require("dotenv").config();
require("./config/mongoose");
require("./config/passport")
app.set("view engine","ejs");
app.set("views", path.join(__dirname, "views"));

const expressSession=require("express-session");
const payment = require("./models/payment");


app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(expressSession({
    resave:false,
    saveUninitialized:false,
    secret:process.env.SESSION_SECRET,
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());
app.use("/",indexRouter);
app.use("/auth",authRouter);
app.use("/admin",adminRouter);
app.use("/products",productRouter);
app.use("/category",categoriesRouter);
app.use("/users",userRouter);
app.use("/cart",cartRouter);
app.use("/payment",paymentRouter);
app.use("/order",orderRouter);
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});


