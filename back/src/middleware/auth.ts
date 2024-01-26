import { NextFunction, Request, Response } from "express";
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';

const auth = async (req:Request, res:Response, next:NextFunction) => {
    const authorizationHeader = req.headers['authorization'];
    
    if (!authorizationHeader) return res.status(401).json({ message: 'Access denied. No token provided.' });
    
    dotenv.config();
    const privateKey = process.env.PRIVATEKEY || 'key';
    try {
        const token = jwt.verify(authorizationHeader, privateKey);
        next();
    } catch {
        return res.status(401).json({ message: 'Invalid token.' });
    }
};

export default auth;
