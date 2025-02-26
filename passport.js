// var GoogleStrategy = require('passport-google-oauth20').Strategy;
// const { userModel }=require("../models/user");
// const passport=require("passport");
// passport.use(new GoogleStrategy({
//     clientID: process.env.GOOGLE_CLIENT_ID,
//     clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//     callbackURL: "http://localhost:3000/auth/google/callback"
//   },
//   async function(accessToken, refreshToken, profile, cb) {
//     try{
//         let user=await userModel.findOne({email :profile.emails[0].value});
//         if(!user){
//         user=new userModel({
//         name :profile.displayName,
//         email: profile.emails[0].value

//         })
//         await user.save();
        
//     }
//     cb(null,user);
// }
//     catch(err){
//         cb(err,false)

//     }
  

//   }
// ));
// console.log(process.env.GOOGLE_CLIENT_ID);
// // session setup krne k liye
// passport.serializeUser(function(user,cb){
//     cb(null,user._id);
// });
// //poore data ka dikhane k liye
// passport.deserializeUser ( async function(){
//     let user=await userModel.findById(id);
// cb(null,user);
// });

// module.exports=passport;
var GoogleStrategy = require('passport-google-oauth20').Strategy;
const { userModel } = require("../models/user");
const passport = require("passport");

 

 
 
require("dotenv").config();  


passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    //callbackURL: process.env.CALLBACK_URL || "http://localhost:3000/auth/google/callback" 
    callbackURL: process.env.CALLBACK_URL || "https://accounts.google.com/o/oauth2/v2/auth/oauthchooseaccount?response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2Fgoogle%2Fcallback&scope=profile%20email&client_id=869975080581-2qfj2pt250ibhe2rcked2voq8qfojvrk.apps.googleusercontent.com&service=lso&o2v=2&ddm=1&flowName=GeneralOAuthFlow" + "/auth/google/callback"
  },
  async function(accessToken, refreshToken, profile, cb) {
    try {
        let user = await userModel.findOne({ email: profile.emails[0].value });

        if (!user) {
            user = new userModel({
                name: profile.displayName,
                email: profile.emails[0].value
            });
            await user.save();
        }

        return cb(null, user);
    } catch (err) {
        return cb(err, false);
    }
  }
));

passport.serializeUser(function(user, cb) {
    cb(null, user._id); // Pass only the ID
});

 
passport.deserializeUser(async function(id, cb) {  
    try {
        let user = await userModel.findById(id);
        cb(null, user);
    } catch (err) {
        cb(err, null);
    }
});



module.exports = passport;