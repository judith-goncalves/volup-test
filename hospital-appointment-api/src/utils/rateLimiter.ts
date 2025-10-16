import rateLimit from "express-rate-limit";

export const patientRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: "Too many requests from this patient. Please wait a minute.",
  keyGenerator: (req) => {
    return req.body.patientId || req.headers["x-patient-id"] || req.ip;
  },
  standardHeaders: true,
  legacyHeaders: false,
});
