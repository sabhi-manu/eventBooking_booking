import sendMail from "../config/nodemailer/nodemailer.js";
import { client } from "../config/redis/redis.js";
import User from "../models/user.js";
import AppError from "../utils/appError.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// async function registerUser(req, res, next) {
//   try {
//     const { userName, email, password } = req.body;
//     if (!userName || !email || !password)
//       throw new AppError(400, "all details are required");
//     const isUser = await User.findOne({ $or: [{ email }, { userName }] });
//     if (isUser) throw new AppError(400, "user already exist.");
//     const hashPassword = await bcrypt.hash(password, 10);
//     const user = await User.create({
//       userName,
//       email,
//       password: hashPassword,
//     });
//     if (!user) throw new AppError(400, " register user unsuccessful.");
//     let otp = Math.floor(100000 + Math.random() * 900000).toString();

//     await client.set(`verifyOtp:${user.email}`, otp, "EX", 300);

//     await sendMail({
//       to: user.email,
//       subject: "verify otp",
//         text: `Your OTP is ${otp}`,
//     });
//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
//     res.cookie("token", token);
//     console.log("final response ==>", user, token);
//     res.status(201).json({
//       success: true,
//       message: "email send to  register successfully.",
//       user,
//       token,
//     });
//   } catch (error) {
//     console.log("error register controller ==>", error.message);
//   }
// }

export async function registerUser(req, res, next) {
  try {
    const { userName, email, password } = req.body;

    if (!userName || !email || !password) {
      return next(new AppError(400, "All fields required"));
    }

    const isUser = await User.findOne({ email });
    if (isUser) {
      return next(new AppError(400, "User already exists"));
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store user temp data in Redis
    await client.set(
      `register:${email}`,
      JSON.stringify({ userName, email, password }),
      "EX",
      300
    );

    await client.set(`otp:${email}`, otp, "EX", 300);

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

// async function loginUser(req, res, next) {
//   try {
//     const { email, userName, password } = req.body;
//     if (!userName || !email || !password) throw new AppError(400, "all details required");
//     const user = await User.findOne({
//       email,
//     });
//     if (!user) throw new AppError(404, "user not found");
//     const isPassword = await bcrypt.compare(password, user.password);
  
//     if (!isPassword) {
//       return next(new AppError(401, "Invalid credentials"));
//     }
//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
//     res.cookie("token", token);
//     res.status(200).json({
//       success: true,
//       message: "user login successfully.",
//       user,
//       token,
//     });
//   } catch (error) {
//     console.log("error in login controller.");
//     next(error);
//   }
// }

// async function verifyOtp(req, res, next) {
//   try {
//     let { otp, email } = req.body;

//         if (!email || !otp) {
//       return next(new AppError(400, "Email and OTP required"));
//     }

//       const storedOtp = await client.get(`verifyOtp:${email}`);

//     if (!storedOtp) {
//       return next(new AppError(400, "OTP expired"));
//     }

//     if (storedOtp !== otp) {
//       return next(new AppError(400, "Invalid OTP"));
//     }

//     const user = await User.findOneAndUpdate(
//       { email },
//       {
//         isVerified: true,
//       },
//          { new: true }
//     );
//       await client.del(`verifyOtp:${email}`);
//     res.status(200).json({
//       success: true,
//       message: "Email verified successfully",
//       user,
//     });
//   } catch (error) {
//     console.log("error in verifyotp", error.message);
//     next(error);
//   }
// }

export async function loginUser(req, res, next) {
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

    const { userName, password } = JSON.parse(userData);

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      userName,
      email,
      password: hashPassword,
      isVerified: true,
    });

    // Clean Redis
    await client.del(`verifyOtp:${email}`);
    await client.del(`register:${email}`);

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

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
