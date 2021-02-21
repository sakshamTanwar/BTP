import { NextFunction, Request } from "express";
import jwt from "jsonwebtoken"
import {IUser} from "../models/user"
import passport from "passport"

export const JWT_SECRET = "jwt_secret";

export function createJwt(user: IUser){
    const payload = {
        name: user.name,
        email: user.email
    }

    const token = jwt.sign(payload, JWT_SECRET, {expiresIn: '1h'});
    return token;
}
