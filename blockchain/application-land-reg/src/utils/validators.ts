import { User } from '../models/user';
import validator from 'validator';
import { Request, Response } from 'express';
import { AppError } from '../utils/error';

const validateUserFields = function (req: Request): any {
    if (!req.body.name) {
        return new AppError(400, 'name_empty', 'Name field cant be empty.');
    }
    if (!req.body.email) {
        return new AppError(400, 'email_empty', 'Email field cant be empty.');
    } else if (!validator.isEmail(req.body.email)) {
        return new AppError(400, 'email_inv', 'Invalid Email');
    }

    if (!req.body.password) {
        return new AppError(
            400,
            'password_empty',
            'Password field cant be empty.',
        );
    } else if (!validator.isAscii(req.body.password)) {
        return new AppError(
            400,
            'password_inv',
            'Password contains invalid characters.',
        );
    }
};

export const validateSignup = function (req: Request) {
    return new Promise(function (resolve, reject) {
        let error = validateUserFields(req);
        if (error) return reject(error);

        User.findOne({ email: req.body.email })
            .then((user) => {
                if (user !== null) {
                    return reject(
                        new AppError(
                            409,
                            'email_exists',
                            'Email is already registered.',
                        ),
                    );
                }
                resolve(null);
            })
            .catch((err) => {
                reject(err);
            });
    });
};
