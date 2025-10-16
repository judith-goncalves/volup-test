# Hospital Appointment App

## 🚀 Descripción

Proyecto de gestión de citas médicas con:

- Backend en Node.js + Express + MongoDB
- Frontend en React Native (Expo)
- Autenticación de pacientes
- Gestión de doctores, citas y slots
- Docker Compose para levantar todo fácilmente

---

## Prerrequisitos

- Docker & Docker Compose
- PowerShell (Windows) o bash/zsh (Linux/Mac)
- Node.js (solo si quieres correr frontend o backend localmente sin Docker)

---

## Levantar proyecto en <5 min

1. Clona el repositorio:

```bash
git clone <repo_url>
cd <repo_name>

# .env.example

# ----------------------------
# Backend
# ----------------------------
MONGO_URI=mongodb://localhost:27017/hospitaldb
JWT_SECRET=your_jwt_secret
PORT=3000
RATE_LIMIT_WINDOW_SEC=60
RATE_LIMIT_MAX_PER_WINDOW=5

# ----------------------------
# Frontend / React Native
# ----------------------------
BACKEND_URL=http://<LOCAL_IP>:3000   # IP local para Expo
EXPO_PUBLIC_URL=http://<LOCAL_IP>:19000

# Opcional
NODE_ENV=development

---

# API Endpoints

## Patients
- `POST /patients` → Registro de paciente
- `POST /patients/login` → Login
- `GET /patients` → Listado de pacientes

## Doctors
- `GET /doctors` → Listado de doctores
- `POST /doctors` → Crear doctor

## Appointments
- `GET /appointments` → Listado de citas
- `POST /appointments` → Crear cita
- `PATCH /appointments/:id/reschedule` → Reagendar cita
- `PATCH /appointments/:id/cancel` → Cancelar cita
- `PATCH /appointments/:id/status` → Actualizar status (`CREATED`, `CONFIRMED`, `COMPLETED`)

> Se recomienda usar Swagger o Postman para probar todos los endpoints.
> Swagger: `http://localhost:3000/api-docs`

```
