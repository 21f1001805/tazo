import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { IUser } from "../model/user.js";

console.log("JWT_SEC:", process.env.JWT_SEC)
export interface AuthenticatedRequest extends Request{
    user?: IUser|null;
}
export const isAuth = async(req:AuthenticatedRequest, res:Response, next:NextFunction):
Promise<void> =>{
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")){
            res.status(401).json({
                message :"Please Login - No auth header",
            });
            return;
        }
        const token = authHeader.split(" ")[1];

        if(!token){
            res.status(401).json({
                message :"Please Login - Token missing",
            });
            return;
        }
        const decodedValue = jwt.verify(token, process.env.JWT_SEC as string) as JwtPayload;

        console.log("Decoded token:", decodedValue);

        if(!decodedValue || !decodedValue.user){
            res.status(401).json({
                message :"Invalid token",
            });
            return;
        }
        req.user = decodedValue.user;
        next();
    } catch (error:any) {
        console.log("JWT verify error:", error.message);
        res.status(500).json({
            message:"Please Login - Jwt error"
        })
    }
}