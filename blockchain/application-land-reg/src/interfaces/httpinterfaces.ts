import { Request, Response, NextFunction } from 'express';
import { IUser } from '../models/user';

export interface IRequest extends Request {
    user: IUser;
}

export interface IResponse extends Response {}
export interface INext extends NextFunction {}
