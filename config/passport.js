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
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { userModel } = require("../models/user");
const passport = require("passport");

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback"
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

console.log("Google Client ID:", process.env.GOOGLE_CLIENT_ID); // Debugging

 
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
