import express from "express";
import { createEvent, deleteEvent, getEventById, getEvents, updateEvent, updateEventImage } from "../controllers/event.controller.js";
import { authrole } from "../middleware/authrole.middleware.js";
import { auth } from "../middleware/auth.middleware.js";
import upload from "../utils/multer.js";

const route = express.Router();

route.post("/", auth, authrole("admin"), upload.single("image") , createEvent )
route.get("/",auth, getEvents )
route.get("/:id", auth, getEventById )
route.patch("/:id",auth, authrole("admin"), updateEvent )
route.delete("/:id",auth, authrole("admin"), deleteEvent )
route.put("/image/:id",auth,authrole("admin"),upload.single("image"),updateEventImage)

export default route; 