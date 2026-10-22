// jwt.ts
// service/jwt.service.ts

import { IUser } from "../models/user.model"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()


// getting key to this file
const JWT_SECRET = process.env.JWT_SECRET as string
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string

// generate access token
export const signAccessToken = (user:IUser):string => {
    return jwt.sign({
        sub: user._id.toString(),
        roles: user.roles,
        email: user.email 
    }, JWT_SECRET, {expiresIn: "30m"})
}

export const signRefreshToken = (user:IUser):string => {
    return jwt.sign({
        sub: user._id.toString(),
    }, JWT_REFRESH_SECRET, {expiresIn: "7d"})
}


// we get access token, and refresh token both in login. you can give your refresh token and get a new access token when it need to be logged in.