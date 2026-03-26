import jwt from "jsonwebtoken";
import AppError from "../utils/appError.js";



export const authmiddleware = (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return next(new AppError(401, "Not authorized"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    next(new AppError(401, "Invalid token"));
  }
};