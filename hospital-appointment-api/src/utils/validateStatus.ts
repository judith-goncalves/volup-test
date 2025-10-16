type AppointmentStatus = "CREATED" | "CONFIRMED" | "CANCELLED" | "COMPLETED";

const validStatusTransitions: Record<AppointmentStatus, AppointmentStatus[]> = {
  CREATED: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["COMPLETED", "CANCELLED"],
  CANCELLED: [],
  COMPLETED: [],
};

export function validTransition(from: string, to: string): boolean {
  return (
    validStatusTransitions[
      from as keyof typeof validStatusTransitions
    ]?.includes(to as AppointmentStatus) ?? false
  );
}
