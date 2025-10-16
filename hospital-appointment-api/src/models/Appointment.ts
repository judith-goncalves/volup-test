import { Schema, model } from "mongoose";

const appointmentSchema = new Schema({
  doctorId: {
    type: Schema.Types.ObjectId,
    ref: "Doctor",
    required: true,
  },
  patientId: {
    type: Schema.Types.ObjectId,
    ref: "Patient",
    required: true,
  },
  scheduledAt: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["CREATED", "CONFIRMED", "CANCELLED", "COMPLETED"],
    default: "CREATED",
  },
  notes: {
    type: String,
  },
});

export const Appointment = model("Appointment", appointmentSchema);
