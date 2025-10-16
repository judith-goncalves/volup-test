import { z } from "zod";

export const doctorSchema = z.object({
  name: z
    .string()
    .min(1, { message: "First name is required" })
    .max(50, { message: "First name is too long" }),
  specialty: z.string().min(1, { message: "Specialization is required" }),
  availableSlots: z.number().int().nonnegative({
    message: "Years of experience must be a non-negative integer",
  }),
  isActive: z.boolean().default(true),
});

export type Doctor = z.infer<typeof doctorSchema>;
