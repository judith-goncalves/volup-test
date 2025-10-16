import Constants from "expo-constants";
import { Platform } from "react-native";
import { Appointment, RescheduleResponse } from "../types/appointment";
import { Doctor } from "../types/doctor";
import { Patient } from "../types/patient";

type ApiResponse<T> = T & { message?: string };

let token: string | null = null;
export const setAuthToken = (t: string) => {
  token = t;
};
const getHeaders = () => ({
  "Content-Type": "application/json",
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
});

const getBackendUrl = (): string => {
  const expoUrl = Constants.expoConfig?.extra?.BACKEND_URL;
  if (expoUrl) return expoUrl;
  if (Platform.OS === "android" && !Constants.isDevice)
    return "http://10.0.2.2:3000";
  if (process.env.BACKEND_URL) return process.env.BACKEND_URL;
  return "http://localhost:3000";
};
export const API_URL = getBackendUrl();

export const registerPatient = async (data: Partial<Patient>) => {
  const res = await fetch(`${API_URL}/patients`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return res.json();
};

export const loginPatient = async (email: string, password: string) => {
  const res = await fetch(`${API_URL}/patients/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
};

export const fetchPatients = async (): Promise<Patient[]> => {
  const res = await fetch(`${API_URL}/patients`, { headers: getHeaders() });
  return res.json();
};

export const fetchDoctors = async (): Promise<Doctor[]> => {
  const res = await fetch(`${API_URL}/doctors`, { headers: getHeaders() });
  return res.json();
};

export const createDoctor = async (
  doctor: Partial<Doctor>
): Promise<ApiResponse<Doctor>> => {
  const res = await fetch(`${API_URL}/doctors`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(doctor),
  });
  return res.json();
};

export const fetchAppointments = async (): Promise<Appointment[]> => {
  const res = await fetch(`${API_URL}/appointments`, { headers: getHeaders() });
  const json = await res.json();
  return json.data || json;
};

export const createAppointment = async (
  data: Partial<Appointment>
): Promise<ApiResponse<Appointment>> => {
  const res = await fetch(`${API_URL}/appointments`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  return res.json();
};

export const cancelAppointment = async (
  id: string
): Promise<ApiResponse<Appointment>> => {
  const res = await fetch(`${API_URL}/appointments/${id}/cancel`, {
    method: "PATCH",
    headers: getHeaders(),
  });
  return res.json();
};

export const rescheduleAppointment = async (
  id: string,
  newDate: string
): Promise<RescheduleResponse> => {
  const res = await fetch(`${API_URL}/appointments/${id}/reschedule`, {
    method: "PATCH",
    headers: getHeaders(),
    body: JSON.stringify({ newScheduledAt: newDate }),
  });
  return res.json();
};

export const updateAppointmentStatus = async (
  appointmentId: string,
  status: "CREATED" | "CONFIRMED" | "COMPLETED"
): Promise<ApiResponse<Appointment>> => {
  const res = await fetch(`${API_URL}/appointments/${appointmentId}/status`, {
    method: "PATCH",
    headers: getHeaders(),
    body: JSON.stringify({ status }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to update appointment status");
  }

  return res.json();
};
