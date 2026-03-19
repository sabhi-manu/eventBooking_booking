import exress from "express"
import { loginUser, registerUser, verifyOtp } from "../controllers/auth.controller.js"

const route = exress.Router()


route.post("/register",registerUser)
route.post("/login",loginUser)
route.post("/verify-otp",verifyOtp)




export default route