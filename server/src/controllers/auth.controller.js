import sendMail from "../config/nodemailer/nodemailer.js";
import { client } from "../config/redis/redis.js";
import User from "../models/user.js";
import AppError from "../utils/appError.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


 async function registerUser(req, res, next) {
  try {
    const { userName, email, password ,role} = req.body;

    if (!userName || !email || !password) {
      return next(new AppError(400, "All fields required"));
    }

    const isUser = await User.findOne({ email });
    if (isUser) {
      return next(new AppError(400, "User already exists"));
    }

   
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    
    await client.set(
      `register:${email}`,
      JSON.stringify({ userName, email, password ,role}),
      "EX",
      300
    );

    await client.set(`verifyOtp:${email}`, otp, "EX", 300);

    await sendMail({
      to: email,
      subject: "Verify OTP",
      text: `Your OTP is ${otp}`,
    });

    res.status(200).json({
      success: true,
      message: "OTP sent to your email",
    });

  } catch (error) {
    next(error); 
  }
}


 async function loginUser(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError(400, "All fields required"));
    }

    const user = await User.findOne({ email });

    if (!user) {
      return next(new AppError(404, "User not found"));
    }

    if (!user.isVerified) {
      return next(new AppError(403, "Please verify your email first"));
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return next(new AppError(401, "Invalid credentials"));
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token);

    res.status(200).json({
      success: true,
      message: "Login successful",
      user,
    });

  } catch (error) {
    next(error);
  }
}


async function verifyOtp(req, res, next) {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return next(new AppError(400, "Email and OTP required"));
    }

    const storedOtp = await client.get(`verifyOtp:${email}`);
    if (!storedOtp) {
      return next(new AppError(400, "OTP expired"));
    }

    if (storedOtp !== otp) {
      return next(new AppError(400, "Invalid OTP"));
    }

    // Get temp data
    const userData = await client.get(`register:${email}`);
    if (!userData) {
      return next(new AppError(400, "Registration expired"));
    }

    const { userName, password ,role } = JSON.parse(userData);

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      userName,
      email,
      password: hashPassword,
      isVerified: true,
      role
    });

    // Clean Redis
    await client.del(`verifyOtp:${email}`);
    await client.del(`register:${email}`);

     const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user,
      token,
    });

  } catch (error) {
    next(error);
  }
}

export { registerUser, loginUser, verifyOtp };
