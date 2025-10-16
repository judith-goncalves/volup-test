import { Router } from "express";
import {
  cancelAppointment,
  createAppointment,
  getAllAppointments,
  getAppointmentById,
  rescheduleAppointment,
  updateAppointmentStatus,
} from "../controllers/appointmentController";
import { rateLimiter } from "../middleware/rateLimiter";

const router = Router();

router.post("/", rateLimiter, createAppointment);

router.get("/", getAllAppointments);

router.get("/:id", getAppointmentById);

router.patch("/:id/status", updateAppointmentStatus);

router.patch("/:id/cancel", cancelAppointment);

router.patch("/:id/reschedule", rescheduleAppointment);

export default router;
