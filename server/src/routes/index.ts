import express, {NextFunction, Request, Response} from "express";
import path from "path"
import {IUser, User} from "../models/user"
import bcrypt from "bcrypt"
import passport from "passport"
import {validateSignup} from "../validators/signup"
import {IError} from "../interfaces/error"
const {isEmpty} = require('lodash');

const router = express.Router();


router.get( "/login", (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname,'..','views','login.html'))
});

router.get("/signup", (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname,'..','views','signup.html'))
});

router.post( "/login", (req: Request, res: Response, next: NextFunction) => {
    let errors: IError[]  = [];
    passport.authenticate('local', function(err:Error, user: IUser) {
        if (err) { 
            errors.push({
                error:"server_err",
                message:"Internal Server Error"
            });
            return res.status(500).json({success: false, errors: errors}); 
        }
        if (!user) { 
            errors.push({
                error:"credentials_inv", 
                message:"Invalid Email or password"
            });
            return res.json({success: false, errors: errors}); 
        }
        req.logIn(user, function(err) {
            if (err) { 
                errors.push({
                    error:"server_err",
                    message:"Internal Server Error"
                });
                return res.status(500).json({success: false, errors: errors}); 
            }
            return res.json({success: true, message: "Login Succesful."});
        });
      })(req, res, next);
});


router.post("/signup", async (req: Request, res: Response) => {
    
    try{
        let errors: IError[]  = [];

        await validateSignup(errors, req);

        if(!isEmpty(errors)){
                return res.json({success: false, errors: errors});
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        let user = new User({
            name: req.body.name,
            email: req.body.email.toLowerCase(),
            password: hashedPassword
        });

        let savedUser = await user.save();
        console.log("User Registered Successfully");
        return res.json({success: true, message: "User Registered"});

    } catch(err){
        return res.status(500).json({
            success: false,
            errors:[
                {
                    error:"server_err", 
                    message:"Internal Server Error"
                }
            ]
        });
    }
    
}); 

router.get("/logout", (req: Request, res: Response)=>{
    if(req.isAuthenticated()){
        req.logout();
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).json({
                    success: false,
                    errors:[
                        {
                            error:"server_err", 
                            message:"Internal Server Error"
                        }
                    ]
                });
            }
    
            req.user = null;
            return res.json({success: true, message: "Logged out successfully"});
        });
    }
    else{
        return res.json({
            success: false,
             errors:[
                {
                    error:"req_inv", 
                    message:"Request is invalid: No login session found."
                }
            ]
        });
    }
    
});


export default router;