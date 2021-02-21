import express from "express";
import path from "path"
import {IUser, User} from "../models/user"
import bcrypt from "bcrypt"
import passport from "passport"
import {validateSignup} from "../validators/signup"
import {AppError} from "../utils/error"
import {IRequest, IResponse, INext} from "../interfaces/httpinterfaces"
import {createJwt} from "../utils/Jwt"

const router = express.Router();

router.get( "/", (req: IRequest, res: IResponse) => {
    res.send("/landrecord");
});


router.get( "/login", (req: IRequest, res: IResponse) => {
    res.sendFile(path.join(__dirname,'..','views','login.html'))
});


router.get("/signup", (req: IRequest, res: IResponse) => {
    res.sendFile(path.join(__dirname,'..','views','signup.html'))
});


router.post( "/login", (req: IRequest, res: IResponse, next: INext) => {
    passport.authenticate('local', {session: false}, function(err:Error, user: IUser) {
        if (err) { 
            return next(err);
        }
        if (!user) { 
            return next(new AppError(401, "credentials_inv", "Invalid Email or password"));
        }
        req.logIn(user, {session: false}, function(err){
            if (err) { 
                next(err);
            }
            const token = createJwt(user);
            return res.json({
                success: true,
                token: token
            });
        });
      })(req, res, next);
});


router.post("/signup", async (req: IRequest, res: IResponse, next: INext) => {
    
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
        const token = createJwt(user);
        return res.json({
            success: true,
            token: token
        });
        // return res.json({success: true, message: "User Registered"});

    } catch(err){
        return next(err);
    }
    
}); 


// router.post("/logout", (req: IRequest, res: IResponse, next: INext)=>{
//     if(req.isAuthenticated()){
//         req.logout();
//         req.session.destroy((err) => {
//             if (err) {
//                 return next(err);
//             }
    
//             req.user = null;
//             return res.json({success: true, message: "Logged out successfully"});
//         });
//     }
//     else{
//         return next(new AppError(400, "req_inv", "Request is invalid: No login session found."));
//     }
    
// });


export default router;