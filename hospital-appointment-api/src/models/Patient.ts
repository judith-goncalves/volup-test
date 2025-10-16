import { Schema, model } from "mongoose";

const patientSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  birthDate: {
    type: Date,
  },
  phone: {
    type: String,
  },
});

export const Patient = model("Patient", patientSchema);
