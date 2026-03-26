import express from "express";
import { createEvent, deleteEvent, getEventById, getEvents,  updateEventDetails,  updateEventImage } from "../controllers/event.controller.js";
import { authrole } from "../middleware/authrole.middleware.js";

import upload from "../utils/multer.js";
import { authmiddleware } from "../middleware/auth.middleware.js";

const route = express.Router();

route.post("/", authmiddleware, authrole("admin"), upload.single("image") , createEvent )
route.get("/",authmiddleware, getEvents )
route.get("/:id", authmiddleware, getEventById )
route.patch("/:id",authmiddleware, authrole("admin"), updateEventDetails )
route.delete("/:id",authmiddleware, authrole("admin"), deleteEvent )
route.put("/image/:id",authmiddleware,authrole("admin"),upload.single("image"),updateEventImage)

export default route; 
