import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import UserRoute from "./routes/auth.route.js"
import EventRoute from "./routes/event.route.js"
import BookingRoute from "./routes/booking.route.js"

const app = express();

// Middlewares
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173", credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

// Routes
app.use("/api/user",UserRoute)
app.use("/api/event",EventRoute)
app.use("/api/booking",BookingRoute)


app.use((err,req,res,next)=>{
    console.log("error : ",err)
      err.statusCode = err.statusCode || 500;
 

  res.status(err.statusCode).json({
    success: false,
 
    message: err.message || "Internal Server Error",
  });
})

export default app;