import { z } from "zod";

export const patientSchema = z.object({
  name: z
    .string()
    .min(1, { message: "First name is required" })
    .max(50, { message: "First name is too long" }),
  email: z.email({ message: "Invalid email address" }),
  password: z.string(),
  birthDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date of birth",
  }),
  phone: z.string().optional(),
});

export type Patient = z.infer<typeof patientSchema>;
