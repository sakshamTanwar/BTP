import express, {NextFunction, Request, Response} from "express";
import path from "path"
import {IUser, User} from "../models/user"
import bcrypt from "bcrypt"
import passport from "passport"
import {validateSignup} from "../validators/signup"
import {AppError} from "../utils/error"

const {isEmpty} = require('lodash');

const router = express.Router();


router.get( "/login", (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname,'..','views','login.html'))
});


router.get("/signup", (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname,'..','views','signup.html'))
});


router.post( "/login", (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('local', function(err:Error, user: IUser) {
        if (err) { 
            return next(err);
        }
        if (!user) { 
            return next(new AppError(401, "credentials_inv", "Invalid Email or password"));
        }
        req.logIn(user, function(err) {
            if (err) { 
                next(err);
            }
            return res.json({success: true, message: "Login Succesful."});
        });
      })(req, res, next);
});


router.post("/signup", async (req: Request, res: Response, next: NextFunction) => {
    
    try{

        let error = await validateSignup(req);
        if(error){
                return next(error);
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
        return next(err);
    }
    
}); 


router.get("/logout", (req: Request, res: Response, next: NextFunction)=>{
    if(req.isAuthenticated()){
        req.logout();
        req.session.destroy((err) => {
            if (err) {
                return next(err);
            }
    
            req.user = null;
            return res.json({success: true, message: "Logged out successfully"});
        });
    }
    else{
        return next(new AppError(400, "req_inv", "Request is invalid: No login session found."));
    }
    
});


export default router;