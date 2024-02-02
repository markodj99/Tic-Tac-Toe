import { Request } from "express";
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import { AuthContext } from "../types/graphqlTypes";

const auth = async (req:Request):Promise<AuthContext | false> => {
    const authorizationHeader = req.headers['authorization'];
    if (!authorizationHeader) return false;
  
    dotenv.config();
    const privateKey = process.env.PRIVATE_KEY || 'key';
  
    try {
      const token = jwt.verify(authorizationHeader, privateKey);
      return { token: authorizationHeader };
    } catch {
      return false;
    }
};

export default auth;
