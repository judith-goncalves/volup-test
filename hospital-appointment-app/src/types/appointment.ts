export interface Appointment {
  _id?: string;
  doctorId: string | { _id: string; name: string; specialty: string };
  patientId: string | { _id: string; name: string };
  scheduledAt: string;
  status: AppointmentStatus;
  notes?: string;
}
export type AppointmentStatus =
  | "CREATED"
  | "CONFIRMED"
  | "CANCELLED"
  | "COMPLETED";

export interface RescheduleResponse {
  message: string;
  appointment: Appointment;
  availableSlots: string[];
}
