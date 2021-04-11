import express from 'express';
import path from 'path';
import passport from 'passport';
import bcrypt from 'bcrypt';
import { IUser, User } from '../models/user';
import { IRequest, IResponse, INext } from '../interfaces/httpinterfaces';
import { AppError } from '../utils/error';
import { validateSignup } from '../utils/validators';
import bodyParser from 'body-parser'
import { isAuth } from '../utils/auth'

const router = express.Router();

router.get('/', isAuth, async (req, res, next) => {
    res.render('home.ejs');
});


router.get('/login', (req: IRequest, res: IResponse) => {
    res.render('login.ejs');
});

router.get('/signup', (req: IRequest, res: IResponse) => {
    res.render('signup.ejs');
});

router.post('/login', bodyParser.urlencoded({ extended: true }), (req: IRequest, res: IResponse, next: INext) => {
    passport.authenticate('local', function(
        err: Error,
        user: IUser,
    ) {
        if (err) {
            return res.render('login.ejs', { errorMsg: err.message });
            // return next(err);
        }
        if (!user) {
            return res.render('login.ejs', { errorMsg: 'Invalid Email or password' });
        }

        req.logIn(user, function(err) {
            if (err) {
                return res.render('login.ejs', { errorMsg: err.message });
            }
            
            res.redirect('/');

        });
    })(req, res, next);
});


router.post('/signup', bodyParser.urlencoded({ extended: true }), async (req: IRequest, res: IResponse, next: INext) => {
    try {
        await validateSignup(req);

        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        let user = new User({
            name: req.body.name,
            email: req.body.email.toLowerCase(),
            password: hashedPassword,
        });

        let savedUser = await user.save();
        return res.render('signup.ejs', {successMsg: "Sign-up successful"});
        // return res.json({success: true, message: "User Registered"});
    } catch (err) {
        return res.render('signup.ejs', { errorMsg: err.message });
    }
});


router.post("/logout", (req: IRequest, res: IResponse)=>{
    req.logout();
    res.redirect('/login');
});



export default router;
