import { Router } from "express";
import {
  getPatientById,
  getPatients,
  loginPatient,
  registerPatient,
} from "../controllers/patientController";

const router = Router();

router.get("/", getPatients);

router.get("/:id", getPatientById);

router.post("/", registerPatient);

router.post("/login", loginPatient);

export default router;
