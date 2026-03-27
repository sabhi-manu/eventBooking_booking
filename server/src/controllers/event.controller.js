import Event from "../models/event.model.js";
import AppError from "../utils/appError.js";
import uploadToCloudinary from "../utils/cloudinary.js";

export async function createEvent(req, res,next) {
  try {
    const {
      title,
      description,
      date,
      location,
      category,
      totalSeat,
      availableSeat,
      ticketPrice,
    } = req.body;
    if (
      !title ||
      !description ||
      !date ||
      !location ||
      !category ||
      !totalSeat ||
      !availableSeat
    )
      throw new AppError(400, "All fields required");

    let uploadedImageUrl = "";
// console.log(title,description,date,location,category,totalSeat,availableSeat,ticketPrice)
    const imageFile = req.file;
   console.log("image file ==>",imageFile)
    if (imageFile) {
      uploadedImageUrl = await uploadToCloudinary(imageFile.path);
    }
    console.log("uploaded image url ==>",uploadedImageUrl)
    const event = new Event({
      title,
      description,
      date,
      location,
      category,
      totalSeat,
      availableSeat,
      image: uploadedImageUrl,
      ticketPrice,
      createdBy: req.user.id,
    });
    await event.save();
console.log("event created ==>", event) 
    res.status(201).json({
      success: true,
      message: "Event created successfully",
      // event,
    });
  } catch (error) {
    console.log("error in create event controller", error.message);
    next(error);
  }
}

export async function getEvents(req, res) {
  const events = await Event.find().populate("createdBy", "userName email");

  res.status(200).json({
    success: true,
    message: "events fetched successfully.",
    events,
  });
}

export async function getEventById(req, res) {
  const { id } = req.params;
  const event = await Event.findById(id).populate(
    "createdBy",
    "userName email",
  );
  if (!event) throw new AppError(404, "Event not found with this id");
  res.status(200).json({
    success: true,
    message: "event fetched successfully.",
    event,
  });
}

export async function updateEventDetails(req, res, next) {
  try {
    const { id } = req.params;

    const event = await Event.findById(id);

    if (!event) {
      return next(new AppError(404, "Event not found"));
    }

    if (event.createdBy.toString() !== req.user.id) {
      return next(new AppError(403, "Not authorized"));
    }

    const allowedFields = [
      "title",
      "description",
      "date",
      "location",
      "category",
      "totalSeat",
      "availableSeat",
      "ticketPrice",
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        event[field] = req.body[field];
      }
    });

    await event.save();

    res.status(200).json({
      success: true,
      message: "Event details updated",
      event,
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteEvent(req, res, next) {
  try {
    const { id } = req.params;
    if (!id) throw new AppError(400, "Event id is required");
    const event = await Event.findById(id);

    if (!event) throw new AppError(400, "id not valid");

    if (event.createdBy.toString() !== req.user.id) {
      return next(new AppError(403, "Not authorized to delete this event"));
    }

    await event.deleteOne();

    res.status(200).json({
      success: true,
      message: "event deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
}

export async function updateEventImage(req, res, next) {
  try {
    const { id } = req.params;

    const event = await Event.findById(id);

    if (!event) {
      return next(new AppError(404, "Event not found"));
    }

    if (event.createdBy.toString() !== req.user.id) {
      return next(new AppError(403, "Not authorized"));
    }

    if (!req.file) {
      return next(new AppError(400, "Image file required"));
    }

    const newImageUrl = await uploadToCloudinary(req.file.path);

    event.image = newImageUrl;

    await event.save();

    res.status(200).json({
      success: true,
      message: "Event image updated",
      event,
    });
  } catch (error) {
    next(error);
  }
}
