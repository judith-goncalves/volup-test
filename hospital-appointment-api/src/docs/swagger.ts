export const swaggerDocument = {
  openapi: "3.1.0",
  info: {
    title: "Hospital Appointment API",
    version: "1.0.0",
    description: "API para gestión de citas médicas",
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Servidor local",
    },
  ],
  paths: {
    "/doctors": {
      get: {
        summary: "Obtener todos los doctores",
        responses: {
          "200": {
            description: "Lista de doctores",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Doctor" },
                },
              },
            },
          },
        },
      },
      post: {
        summary: "Crear un nuevo doctor",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/DoctorInput" },
            },
          },
        },
        responses: {
          "201": {
            description: "Doctor creado exitosamente",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Doctor" },
              },
            },
          },
        },
      },
    },
    "/doctors/{id}": {
      get: {
        summary: "Obtener un doctor por ID",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "ID del doctor",
          },
        ],
        responses: {
          "200": {
            description: "Doctor encontrado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Doctor" },
              },
            },
          },
          "404": { description: "Doctor no encontrado" },
        },
      },
    },
    "/patients": {
      get: {
        summary: "Obtener todos los pacientes",
        responses: {
          "200": {
            description: "Lista de pacientes",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Patient" },
                },
              },
            },
          },
        },
      },
      post: {
        summary: "Registrar un nuevo paciente",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/PatientInput" },
            },
          },
        },
        responses: {
          "201": {
            description: "Paciente creado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Patient" },
              },
            },
          },
        },
      },
    },
    "/patients/{id}": {
      get: {
        summary: "Obtener un paciente por ID",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "ID del paciente",
          },
        ],
        responses: {
          "200": {
            description: "Paciente encontrado",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Patient" },
              },
            },
          },
          "404": { description: "Paciente no encontrado" },
        },
      },
    },
    "/patients/login": {
      post: {
        summary: "Iniciar sesión con el paciente",
        responses: {
          "200": {
            description: "Sesión iniciada",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Patient" },
              },
            },
          },
          "404": { description: "Error al iniciar sesión" },
        },
      },
    },
    "/appointments": {
      get: {
        summary: "Obtener todas las citas",
        parameters: [
          {
            name: "doctorId",
            in: "query",
            schema: { type: "string" },
            description: "Filtrar por ID de doctor",
          },
          {
            name: "patientId",
            in: "query",
            schema: { type: "string" },
            description: "Filtrar por ID de paciente",
          },
          {
            name: "status",
            in: "query",
            schema: {
              type: "string",
              enum: ["CREATED", "CONFIRMED", "CANCELLED", "COMPLETED"],
            },
            description: "Filtrar por estado de cita",
          },
          {
            name: "from",
            in: "query",
            schema: { type: "string", format: "date-time" },
            description: "Fecha inicio",
          },
          {
            name: "to",
            in: "query",
            schema: { type: "string", format: "date-time" },
            description: "Fecha fin",
          },
        ],
        responses: {
          "200": {
            description: "Lista de citas",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: { $ref: "#/components/schemas/Appointment" },
                },
              },
            },
          },
        },
      },
      post: {
        summary: "Crear una nueva cita",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/AppointmentInput" },
            },
          },
        },
        responses: {
          "201": {
            description: "Cita creada",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Appointment" },
              },
            },
          },
        },
      },
    },
    "/appointments/{id}": {
      get: {
        summary: "Obtener una cita por ID",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
            description: "ID de la cita",
          },
        ],
        responses: {
          "200": {
            description: "Cita encontrada",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/Appointment" },
              },
            },
          },
          "404": { description: "Cita no encontrada" },
        },
      },
    },
  },
  components: {
    schemas: {
      Doctor: {
        type: "object",
        properties: {
          id: { type: "string" },
          name: { type: "string" },
          specialty: { type: "string" },
          availableSlots: {
            type: "array",
            items: { type: "string", format: "date-time" },
          },
          isActive: { type: "boolean" },
        },
        required: ["id", "name", "specialty", "availableSlots", "isActive"],
      },
      DoctorInput: {
        type: "object",
        properties: {
          name: { type: "string" },
          specialty: { type: "string" },
          availableSlots: {
            type: "array",
            items: { type: "string", format: "date-time" },
          },
          isActive: { type: "boolean" },
        },
        required: ["name", "specialty", "availableSlots", "isActive"],
      },
      Patient: {
        type: "object",
        properties: {
          id: { type: "string" },
          name: { type: "string" },
          email: { type: "string", format: "email" },
          birthDate: { type: "string", format: "date" },
          phone: { type: "string" },
        },
        required: ["id", "name", "email", "birthDate", "phone"],
      },
      PatientInput: {
        type: "object",
        properties: {
          name: { type: "string" },
          email: { type: "string", format: "email" },
          birthDate: { type: "string", format: "date" },
          phone: { type: "string" },
        },
        required: ["name", "email", "birthDate", "phone"],
      },
      Appointment: {
        type: "object",
        properties: {
          id: { type: "string" },
          doctorId: { type: "string" },
          patientId: { type: "string" },
          scheduledAt: { type: "string", format: "date-time" },
          status: {
            type: "string",
            enum: ["CREATED", "CONFIRMED", "CANCELLED", "COMPLETED"],
          },
          notes: { type: "string" },
        },
        required: ["id", "doctorId", "patientId", "scheduledAt", "status"],
      },
      AppointmentInput: {
        type: "object",
        properties: {
          doctorId: { type: "string" },
          patientId: { type: "string" },
          scheduledAt: { type: "string", format: "date-time" },
          notes: { type: "string" },
        },
        required: ["doctorId", "patientId", "scheduledAt"],
      },
    },
  },
};
