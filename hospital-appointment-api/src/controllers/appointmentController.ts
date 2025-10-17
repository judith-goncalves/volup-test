import { Request, Response } from "express";
import { Appointment } from "../models/Appointment";
import { Doctor } from "../models/Doctor";
import { appointmentSchema } from "../schemas/appointmentSchema";
import { validTransition } from "../utils/validateStatus";

export const getAllAppointments = async (req: Request, res: Response) => {
  try {
    const {
      doctorId,
      patientId,
      status,
      from,
      to,
      page = 1,
      limit = 10,
    } = req.query;
    const filters: any = {};
    if (doctorId) filters.doctorId = doctorId;
    if (patientId) filters.patientId = patientId;
    if (status) filters.status = status;
    if (from || to) {
      filters.scheduledAt = {};
      if (from) filters.scheduledAt.$gte = new Date(String(from));
      if (to) filters.scheduledAt.$lte = new Date(String(to));
    }

    const appointments = await Appointment.find(filters)
      .populate("doctorId")
      .populate("patientId")
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .sort({ scheduledAt: 1 });

    const total = await Appointment.countDocuments(filters);

    res.json({
      total,
      page: Number(page),
      limit: Number(limit),
      data: appointments,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching appointments" });
  }
};

export const getAppointmentById = async (req: Request, res: Response) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate("doctorId")
      .populate("patientId");
    if (!appointment)
      return res.status(404).json({ message: "Appointment not found" });
    res.json(appointment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching appointment" });
  }
};

export const createAppointment = async (req: Request, res: Response) => {
  try {
    const { doctorId, patientId, scheduledAt, notes } = appointmentSchema.parse(
      req.body
    );

    const doctor = await Doctor.findById(doctorId);
    if (!doctor || !doctor.isActive)
      return res.status(404).json({ message: "Doctor not found or inactive" });
    if (!doctor.availableSlots.includes(scheduledAt))
      return res.status(400).json({ message: "Scheduled time not available" });

    const overlap = await Appointment.findOne({
      doctorId,
      scheduledAt: new Date(scheduledAt),
      status: { $in: ["CREATED", "CONFIRMED"] },
    });
    if (overlap)
      return res
        .status(400)
        .json({ message: "Doctor already has an appointment at this time" });

    const newAppointment = await Appointment.create({
      doctorId,
      patientId,
      scheduledAt: new Date(scheduledAt),
      notes,
      status: "CREATED",
    });

    doctor.availableSlots = doctor.availableSlots.filter(
      (slot) => slot !== scheduledAt
    );
    await doctor.save();

    res
      .status(201)
      .json({ message: "Appointment created", appointment: newAppointment });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error creating appointment",
      error: (err as Error).message,
    });
  }
};

export const cancelAppointment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findById(id);
    if (!appointment)
      return res.status(404).json({ message: "Appointment not found" });

    if (appointment.scheduledAt <= new Date())
      return res
        .status(400)
        .json({ message: "Cannot cancel past appointment" });
    if (["COMPLETED", "CANCELLED"].includes(appointment.status))
      return res.status(400).json({
        message: `Appointment already ${appointment.status.toLowerCase()}`,
      });

    appointment.status = "CANCELLED";
    await appointment.save();

    res.json({ message: "Appointment cancelled successfully", appointment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error cancelling appointment" });
  }
};

export const rescheduleAppointment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { newScheduledAt } = req.body;

    const appointment = await Appointment.findById(id);
    if (!appointment)
      return res.status(404).json({ message: "Appointment not found" });

    const doctor = await Doctor.findById(appointment.doctorId);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    if (!doctor.availableSlots.includes(newScheduledAt))
      return res
        .status(400)
        .json({ message: "New time not available for doctor" });

    const conflict = await Appointment.findOne({
      _id: { $ne: appointment._id },
      doctorId: appointment.doctorId,
      scheduledAt: new Date(newScheduledAt),
      status: { $in: ["CREATED", "CONFIRMED"] },
    });
    if (conflict)
      return res.status(400).json({ message: "New slot already taken" });

    appointment.scheduledAt = new Date(newScheduledAt);
    await appointment.save();

    const occupiedSlots = await Appointment.find({
      doctorId: doctor._id,
      status: { $in: ["CREATED", "CONFIRMED"] },
    }).select("scheduledAt");

    const occupiedSet = new Set(
      occupiedSlots.map((a) => a.scheduledAt.toISOString())
    );
    const updatedSlots = doctor.availableSlots.filter(
      (s) => !occupiedSet.has(s)
    );

    res.json({
      message: "Appointment rescheduled successfully",
      appointment,
      availableSlots: updatedSlots,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error rescheduling appointment" });
  }
};

export const updateAppointmentStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status: newStatus } = req.body;

    const appointment = await Appointment.findById(id);
    if (!appointment)
      return res.status(404).json({ message: "Appointment not found" });

    if (!validTransition(appointment.status, newStatus)) {
      return res.status(400).json({
        message: `Invalid transition from ${appointment.status} to ${newStatus}`,
      });
    }

    appointment.status = newStatus;
    await appointment.save();

    res.json({
      message: `Appointment status updated (${appointment.status} → ${newStatus})`,
      appointment,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error updating appointment status",
      error: (err as Error).message,
    });
  }
};
