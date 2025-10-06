export interface Reminder {
  daysInAdvance: number;
  id: string;
}

export interface Patient {
  id: string;
  name: string;
  appointmentDate: Date;
  createdAt: Date;
  reminders: Reminder[];
}
