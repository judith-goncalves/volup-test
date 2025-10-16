import { z } from "zod";

export const appointmentSchema = z.object({
  doctorId: z.string(),
  patientId: z.string(),
  scheduledAt: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format",
  }),
  status: z.enum(["CREATED", "CONFIRMED", "CANCELLED", "COMPLETED"]).optional(),
  notes: z.string().optional(),
});

export type AppointmentInput = z.infer<typeof appointmentSchema>;
