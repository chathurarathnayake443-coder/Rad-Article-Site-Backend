import { Request, Response } from "express"
import { UserModel, UserRole } from "../models/user.model"
import bcrypt from "bcryptjs"
import { signAccessToken, signRefreshToken } from "../utils/token"
import { AuthRequest } from "../middleware/auth"
import jwt from "jsonwebtoken"

export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body
    const extUser = await UserModel.findOne({ email })
    if (extUser) {
      return res.status(400).json({
        message: "User already exists..!"
      })
    }
    const salt = bcrypt.genSaltSync(10)
    const hashedPassword = bcrypt.hashSync(password, salt)

    const newUser = new UserModel({
      name,
      email,
      password: hashedPassword,
      roles: [UserRole.USER],
      approve: true
    })
    await newUser.save()
    res.status(201).json({ message: "User registered successfully..!" })
  } catch (err) {
    console.error(err)
    res.status(500).json({
      message: "Registration fail",
      error: err
    })
  }
}

export const home = (req: Request, res: Response) => {
  res.status(200).json({
    message: "Welcome to the RAD Article API"
  })
}

export const login = async (req: Request, res: Response) => {
  const {email, password} = req.body
  try{
    if(!email || !password){
      return res.status(400).json({message:"Email Or Password Missing!..."})
    }

    const user = await UserModel.findOne({email})
    if(!user){
      res.status(401).json({message:"User Not Found..."})
    }

    const isValid = await bcrypt.compare(password, user?.password)
    if(!isValid){
      res.status(401).json({message:"Invalid Credentials..."})
    }

    const accessToken = signAccessToken(user)
    const refreshToken = signRefreshToken(user)

    res.status(200).json({message:"Authentication Successful", data: {
      email: user?.email,
      roles: user?.roles,
      access_token: accessToken,
      refresh_token: refreshToken
    }})
  }
  catch(error){
    console.log("Error in login", error)
  }
}

// protected Endpoints

export const getMyDetails = async (req:AuthRequest, res:Response) => {
  // req.user -> sub - userId, roles
  if(!req.user){
    return res.status(401).json({message:"Unauthorized !..."})
  }

  const userId = req.user.sub
  const user = await UserModel.findById(userId).select("-password") // give me without password field

  if(!user){
    return res.status(404).json({message:"User Not Found !..."})
  }

  const {name, email, roles, _id} = user

  res.status(200).json({message:"Success !", data:{name, email, roles, id:_id}})
}

const JWT_REFRESH_TOKEN = process.env.JWT_REFRESH_SECRET as string

export const getRefreshToken = async(req:Request, res:Response) => {
  const {refreshToken} = req.body
  try{
    if(!refreshToken){
      return res.status(400).json({message:"Token Not Found !..."})
    }

    const payload = jwt.verify(refreshToken, JWT_REFRESH_TOKEN)
    const userId = payload?.sub 
    const user = await UserModel.findById(userId)

    if(!user){
      return res.status(403).json({message:"Invalid or Expired Token !..."})
    }

    const newAccessToken = signAccessToken(user)
    res.status(200).json({
      data:{accessToken : newAccessToken}
    })
  }
  catch(error){
    res.status(403).json({
      message:"Invalid or Expired Token !..."
    })
  }
}



// lets automate the refresh token process.
// to do this, we need to catch the time which the access token expires. we can use interceptors here.
// if the response have an error, we can think that it may be because of an expired token. (we have to write a logic to check this)
// we use Response Interceptor here instead of a normal interceptor.