import express from "express";
import {
  createEvent,
  listEvents,
  getEvent,
  updateEvent,
  deleteEvent,
} from "../controllers/event.controller.js";

import {
  createParticipant,
  listParticipants,
} from "../controllers/participant.controller.js";

import {
  registerAttendance,
  listAttendees,
} from "../controllers/attendance.controller.js";

const router = express.Router();

// Events
router.post("/events", createEvent);
router.get("/events", listEvents);
router.get("/events/:id", getEvent);
router.put("/events/:id", updateEvent);
router.delete("/events/:id", deleteEvent);

// Participants
router.post("/participants", createParticipant);
router.get("/participants", listParticipants);

// Attendance
router.post("/events/:id/register", registerAttendance);
router.get("/events/:id/attendees", listAttendees);

export default router;
