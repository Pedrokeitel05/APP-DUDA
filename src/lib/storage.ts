import { Patient } from "@/types/patient";

const PATIENTS_KEY = "clinic_patients";

export const storage = {
  getPatients: (): Patient[] => {
    const data = localStorage.getItem(PATIENTS_KEY);
    if (!data) return [];
    
    const patients = JSON.parse(data);
    return patients.map((p: Patient) => ({
      ...p,
      appointmentDate: new Date(p.appointmentDate),
      createdAt: new Date(p.createdAt),
    }));
  },

  savePatients: (patients: Patient[]): void => {
    localStorage.setItem(PATIENTS_KEY, JSON.stringify(patients));
  },
};
