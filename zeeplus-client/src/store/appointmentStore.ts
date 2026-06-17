import { create } from "zustand";
import type { Appointment } from "@/types/appointment";

interface State {
  appointments: Appointment[];
  add: (a: Appointment) => void;
  update: (id: string, patch: Partial<Appointment>) => void;
  remove: (id: string) => void;
  getPatientAppointments: (patientId: string) => Appointment[];
  getAdminAppointments: () => Appointment[];
}

export const useAppointmentStore = create<State>((set, get) => ({
  appointments: [],

  add: (a) => set((s) => ({ appointments: [a, ...s.appointments] })),

  update: (id, patch) =>
    set((s) => ({
      appointments: s.appointments.map((x) => (x.id === id ? { ...x, ...patch } : x)),
    })),

  remove: (id) =>
    set((s) => ({
      appointments: s.appointments.filter((x) => x.id !== id),
    })),

  getPatientAppointments: (patientId: string) => {
    return get().appointments.filter((apt) => apt.patientId === patientId);
  },

  getAdminAppointments: () => {
    return get().appointments;
  },
}));
