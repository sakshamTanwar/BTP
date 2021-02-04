import express from "express";
import path from "path"


const User = require('../models/user');
const router = express.Router();

router.get( "/login", (req, res) => {
    res.sendFile(path.join(__dirname,'..','views','login.html'))
});

router.post( "/login", (req, res) => {    
    //Add Functionality
    console.log(req.body.email);
    res.send("Login")
});

router.get("/signup", (req, res) => {
    res.sendFile(path.join(__dirname,'..','views','signup.html'))
})

router.post("/signup", (req, res) => {
     const user = new User({
         name: req.body.name,
         email: req.body.email,
         password: req.body.password
     });

     user.save()
     .then((data:any)=>{
         console.log("User Registered Successfully");
         res.json(data);
     }).catch((err:any)=>{
         res.json({message: err});
     })
})

module.exports = router;