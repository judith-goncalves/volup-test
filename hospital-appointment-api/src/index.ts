import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express, { Request, Response } from "express";
import swaggerUi from "swagger-ui-express";
import { connectDB } from "./config/database";
import { swaggerDocument } from "./docs/swagger";
import { seedData } from "./seed";

import appointmentRouter from "./routes/appointments";
import doctorRouter from "./routes/doctors";
import patientRouter from "./routes/patients";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

(async () => {
  await connectDB();
  await seedData();

  app.use(cors());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  app.get("/", (req: Request, res: Response) => {
    res.send({ message: "API is running correctly" });
  });

  app.use("/appointments", appointmentRouter);
  app.use("/doctors", doctorRouter);
  app.use("/patients", patientRouter);

  app.listen(3000, "0.0.0.0", () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
  });
})();
