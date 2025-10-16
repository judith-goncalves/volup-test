import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Patient } from "../models/Patient";

export const getPatients = async (_req: Request, res: Response) => {
  try {
    const patients = await Patient.find().select("-password");
    res.json(patients);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching patients" });
  }
};

export const getPatientById = async (req: Request, res: Response) => {
  try {
    const patient = await Patient.findById(req.params.id).select("-password");
    if (!patient) return res.status(404).json({ message: "Patient not found" });
    res.json(patient);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching patient" });
  }
};

export const registerPatient = async (req: Request, res: Response) => {
  try {
    const { name, email, password, phone, birthDate } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "Missing required fields" });

    const existing = await Patient.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Patient already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const patient = await Patient.create({
      name,
      email,
      password: hashed,
      phone,
      birthDate,
    });

    const token = jwt.sign({ id: patient._id }, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });

    res
      .status(201)
      .json({ patient: { ...patient.toObject(), password: undefined }, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error registering patient" });
  }
};

export const loginPatient = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Missing required fields" });

    const patient = await Patient.findOne({ email });
    if (!patient) return res.status(404).json({ message: "Patient not found" });

    const valid = await bcrypt.compare(password, patient.password);
    if (!valid) return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: patient._id }, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });

    res.status(200).json({
      message: "Login successful",
      patient: { ...patient.toObject(), password: undefined },
      token,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error logging in patient" });
  }
};
