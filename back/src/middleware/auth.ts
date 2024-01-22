import { NextFunction, Request, Response } from "express";
import * as jwt from 'jsonwebtoken'

const auth = async (req:Request, res:Response, next:NextFunction) => {
    const authorizationHeader = req.headers['authorization'];
    
    if (!authorizationHeader) return res.status(401).json({ message: 'Access denied. No token provided.' });
    
    try {
        const token = jwt.verify(authorizationHeader, 'secretKey');
        next();
    } catch {
        return res.status(401).json({ message: 'Invalid token.' });
    }
};

export default auth;
