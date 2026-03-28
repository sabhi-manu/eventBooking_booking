import express from "express";
import { createEvent, deleteEvent, getEventById, getEvents,  updateEventDetails,  updateEventImage } from "../controllers/event.controller.js";
import { authrole } from "../middleware/authrole.middleware.js";

import upload from "../utils/multer.js";
import { authmiddleware } from "../middleware/auth.middleware.js";

const route = express.Router();

route.post("/", authmiddleware, authrole("admin"), upload.single("image") , createEvent )
route.get("/", getEvents )
route.get("/:id", getEventById )
route.patch("/:id",authmiddleware, authrole("admin"), updateEventDetails )
route.delete("/:id",authmiddleware, authrole("admin"), deleteEvent )
route.patch("/image/:id",authmiddleware,authrole("admin"),upload.single("image"),updateEventImage)

export default route; 
