import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET as string
export interface AuthRequest extends Request{
    user?: any
}

export const authenticate = (req:AuthRequest, res:Response, next:NextFunction) => {
    const authHeader = req.headers.authorization

    if(!authHeader){
        return res.status(401).json({message:"Token Not Found ! ..."})
    }

    // Bearer Token

    const token = authHeader.split(" ")[1] // creates an array by splitting the token string from its space in between, and access its 1 index element. it is the token
    try{
        const payload = jwt.verify(token, JWT_SECRET) // returns details of user in token (payload)
        req.user = payload  // because there's no user type in request, we created an interface by adding it.
        next()
    }
    catch(error){
        res.status(401).json({message:"Invalid or Expired Token !..."})
    }
}