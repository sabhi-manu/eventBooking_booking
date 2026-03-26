import sendMail from "../config/nodemailer/nodemailer.js";
import Booking from "../models/booking.model.js";
import Event from "../models/event.model.js";
import AppError from "../utils/appError.js";

async function bookEventController(req, res, next) {
  try {
    const { id } = req.params;
    const event = await Event.findById(id);
    if (!event) {
      throw new AppError(404, "Event not found.");
    }
    if (event.availableSeat <= 0) throw new AppError(400, "No seats available");

    const existingBooking = await Booking.findOne({
      userId: req.user.id,
      eventId: id,
    });
    if (existingBooking && existingBooking.status !== "cancelled")
      throw new AppError(400, "already booked or pending");

    const booking = await Booking.create({
      userId: req.user.id,
      eventId: id,
      status: "pending",
      paymentStatus: "not_paid",
      amount: event.ticketPrice,
    });
    res.status(201).json({
      message: "booking request submitted",
      booking,
    });
  } catch (error) {
    console.log("error in booking event controller ==>", error.message);
    next(error);
  }
}

async function confirmBookingController(req, res, next) {
  try {
    const { id } = req.params; // booking id
    const { paymentStatus } = req.body;  // confirmed or cancelled

    const booking = await Booking.findById(id)
      .populate("userId")
      .populate("eventId");

    if (!booking) {
      return next(new AppError(404, "Booking not found"));
    }

    if (booking.status === "confirmed") {
      return next(new AppError(400, "Booking already confirmed"));
    }

  
    const updatedEvent = await Event.findOneAndUpdate(
      {
        _id: booking.eventId._id,
        availableSeat: { $gt: 0 }, 
      },
      {
        $inc: { availableSeat: -1 },
      },
      {
        new: true,
      },
    );

   
    if (!updatedEvent) {
      return next(new AppError(400, "No seats available"));
    }

    booking.status = "confirmed";

    if (paymentStatus) {
      booking.paymentStatus = paymentStatus;
    }

    await booking.save();


    await sendMail({
      to: booking.userId.email,
      subject: "Event Booking Confirmed",
      text: "Your booking is confirmed. Enjoy the event 🎉",
    });

    res.status(200).json({
      success: true,
      message: "Booking confirmed successfully",
      booking,
    });
  } catch (error) {
    console.log("Error in confirm booking:", error.message);
    next(error);
  }
}

async function getBookingController(req, res, next) {
  try {
    const booking =
      req.user.role == "admin"
        ? await Booking.find()
            .populate("eventId")
            .populate("userId", "email userName")
        : await Booking.find({ userId: req.user.id }).populate("eventId");

    res.status(200).json({
      message: "booking fetch successfully.",
      booking,
    });
  } catch (error) {
    console.log("error in getting booking details.");
    next(error);
  }
}

async function cancelBooking(req, res, next) {
  try {
    const { id } = req.params; // booking id
    const booking = await Booking.findById(id);
    if (!booking) throw new AppError(404, "booking not found.");

    if (
      booking.userId.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      throw new AppError(403, "Not authorized");
    }

    if (booking.status == "cancelled")
      throw new AppError(400, "already canclled");

    const isBookingConfirmed = booking.status === "confirmed";

    booking.status = "cancelled";
    await booking.save();
    if (isBookingConfirmed) {
      if (
        booking.userId.toString() !== req.user.id &&
        req.user.role !== "admin"
      ) {
        throw new AppError(403, "Not authorized");
      }
    }
    res.status(200).json({
      message: "booking cancelled successfully.",
    });
  } catch (error) {
    console.log("error in booking cancle controller.==>");
    next(error);
  }
}

export {
  bookEventController,
  confirmBookingController,
  getBookingController,
  cancelBooking,
};
