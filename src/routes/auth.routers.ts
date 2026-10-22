import { Router } from "express"
import { getMyDetails, login, register, home, getRefreshToken } from "./../controllers/auth.controller"
import { authenticate } from "../middleware/auth"

const router = Router()

// public 
router.post("/home", home)
router.post("/login", login)
router.post("/register", register)
router.post("/refresh", getRefreshToken)

// protected
router.get("/me", authenticate, getMyDetails) // setted the middleware only in the endpoints we want

export default router