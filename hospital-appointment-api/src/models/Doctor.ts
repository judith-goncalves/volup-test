import { Schema, model } from "mongoose";

const doctorSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  specialty: {
    type: String,
    required: true,
  },
  availableSlots: {
    type: [String],
  },
  isActive: {
    type: Boolean,
    required: false,
    default: true,
  },
});

export const Doctor = model("Doctor", doctorSchema);
