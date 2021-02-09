import {User} from "../models/user";
import validator from "validator"
import {IError} from "../interfaces/error"
import {Request, Response} from "express"

const validateUserFields = function(errors: IError[], req: Request) {
    if(!req.body.name){
		errors.push({
			error: "name_empty",
			message:"Name field cant be empty."
		});
	}
	if(!req.body.email){
		errors.push({
			error: "email_empty",
			message:"Email field cant be empty."
		});
	}
	else if (!validator.isEmail(req.body.email)) {
		errors.push({
			error: "email_inv",
			message:"Invalid Email"
		});
	}

	if(!req.body.password){
		errors.push({
			error: "password_empty",
			message:"Password field cant be empty."
		});
	}
	else if (!validator.isAscii(req.body.password)) {
		errors.push({
			error: "password_inv",
			message:"Password contains invalid characters."
		});	
	}
}

export const validateSignup = function(errors: IError[], req: Request) {

	return new Promise(function(resolve, reject) {
		validateUserFields(errors, req);
		User.findOne({ email: req.body.email})
		.then(user => {
			if (user !== null) {
				errors.push({
					error: "email_exists",
					message:"Email is already registered."
				});
			}
			resolve(errors);
		})
		.catch(err=>{
			reject();
		})
	})
}