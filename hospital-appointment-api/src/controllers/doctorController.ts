import { Request, Response } from "express";
import { Doctor } from "../models/Doctor";

export const getDoctors = async (_req: Request, res: Response) => {
  const doctors = await Doctor.find();
  res.json(doctors);
};

export const getDoctorById = async (req: Request, res: Response) => {
  const doctor = await Doctor.findById(req.params.id);
  if (!doctor) return res.status(404).json({ message: "Doctor not found" });
  res.json(doctor);
};

export const createDoctor = async (req: Request, res: Response) => {
  const doctor = new Doctor(req.body);
  await doctor.save();
  res.status(201).json(doctor);
};
