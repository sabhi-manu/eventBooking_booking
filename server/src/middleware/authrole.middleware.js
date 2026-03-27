import AppError from "../utils/appError.js";


export function authrole(...role){
    return (req,res,next)=>{
        if(!req.user.role)
            return next(new AppError(401, "Not authorized"));
        if(!role.includes(req.user.role))
            return next(new AppError(403, "Insufficient permissions"));
        next();
    }
}