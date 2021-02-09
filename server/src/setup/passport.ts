import {User, IUser} from "../models/user"
import bcrypt from "bcrypt"
import passportLocal from "passport-local"
import passport, { PassportStatic } from "passport";
import { NativeError } from "mongoose";


let LocalStrategy = passportLocal.Strategy;

export default function(passport: PassportStatic) {
	passport.serializeUser(function(user: IUser, done) {
		done(null, user.id)
	});

	passport.deserializeUser(function(id, done) {
		User.findById(id, (err: NativeError, user:IUser) => {
			done(err, user);
		})
	});

	passport.use(new LocalStrategy({
		usernameField: 'email', 
		passwordField: 'password',
	},
	(email, password, done)=>{
		email = email.toLowerCase();
	    User.findOne({
		    email : email
		}).then(user => {
			if (!user) return done(null, false);
			bcrypt.compare(password, user.password, (err, result)=>{
				if(err) return done(null, false, {message: err.message});
				if(result) return done(null, user);
				else return done(null, false);
			})
			
		}).catch(err => {
			done(err, false);
		})
	}))
}

