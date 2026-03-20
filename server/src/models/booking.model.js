import mongoose from "mongoose"

const bookingSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        requied:true
    },
    eventId:{
        type:mongoose.Schema.ObjectId,
        ref:"Event",
        required:true
    },
    status:{
        type:String,
        enum:["confirmed","cancelled","pending"],
        default:"pending"
    },
    paymentStatus:{
        type:String,
        enum:["paid","not_paid"],
        default:"not_paid"
    },
    amount:{
        type:Number,
        reqired:true
    }
},{timestamps:true})

const Booking = mongoose.model("Booking",bookingSchema)
export default Booking