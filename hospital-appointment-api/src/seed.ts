import bcrypt from "bcryptjs";
import { Appointment } from "./models/Appointment";
import { Doctor } from "./models/Doctor";
import { Patient } from "./models/Patient";

const randomFutureDate = (minDaysAhead = 1, maxDaysAhead = 30): string => {
  const daysAhead =
    Math.floor(Math.random() * (maxDaysAhead - minDaysAhead + 1)) +
    minDaysAhead;
  const randomHour = Math.floor(Math.random() * 8) + 8;
  const date = new Date();
  date.setDate(date.getDate() + daysAhead);
  date.setHours(randomHour, 0, 0, 0);
  return date.toISOString();
};

const generateSlots = (count = 2): string[] => {
  const slots = new Set<string>();
  while (slots.size < count) {
    slots.add(randomFutureDate());
  }
  return Array.from(slots);
};

export const seedData = async () => {
  await Appointment.deleteMany({});
  await Doctor.deleteMany({});
  await Patient.deleteMany({});

  await Doctor.insertMany([
    {
      name: "Dr. Gomez",
      specialty: "Cardiology",
      availableSlots: generateSlots(3),
      isActive: true,
    },
    {
      name: "Dr. Lopez",
      specialty: "Pediatrics",
      availableSlots: generateSlots(2),
      isActive: true,
    },
    {
      name: "Dr. Gonzalez",
      specialty: "Neurology",
      availableSlots: generateSlots(3),
      isActive: true,
    },
  ]);
  console.log("Doctors seeded");

  await Patient.insertMany([
    {
      name: "Juan Perez",
      email: "juan@test.com",
      birthDate: new Date("1990-01-01"),
      password: await bcrypt.hash("juan123", 10),
    },
    {
      name: "Ana Ruiz",
      email: "ana@test.com",
      birthDate: new Date("1985-03-15"),
      password: await bcrypt.hash("ana123", 10),
    },
  ]);
  console.log("Patients seeded");

  console.log("Seed completed successfully");
};
