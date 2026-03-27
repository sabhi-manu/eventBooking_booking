import express from "express"
import { authmiddleware } from "../middleware/auth.middleware.js"
import { authrole } from "../middleware/authrole.middleware.js"
import { bookEventController, cancelBooking, confirmBookingController, getBookingController } from "../controllers/booking.controller.js"

const route = express.Router()

route.post("/:id",authmiddleware,bookEventController)
route.patch("/:id/confirm",authmiddleware,authrole("admin"),confirmBookingController)
route.get("/",authmiddleware,getBookingController)
route.patch("/:id",authmiddleware,cancelBooking)

export default route
