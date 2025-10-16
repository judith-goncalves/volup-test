import { Router } from "express";
import {
  createDoctor,
  getDoctorById,
  getDoctors,
} from "../controllers/doctorController";

const router = Router();

router.get("/", getDoctors);

router.get("/:id", getDoctorById);

router.post("/", createDoctor);

export default router;
