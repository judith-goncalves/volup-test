export interface Doctor {
  _id?: string;
  name: string;
  specialty: string;
  availableSlots?: string[];
  isActive?: boolean;
}
