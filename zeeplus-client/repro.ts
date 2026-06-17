import { useAppointmentStore } from "./src/store/appointmentStore";

const patientId = "00000000-0000-1000-8000-000000000000";
const apt = {
    id: "some-id",
    patientId: patientId,
    // ... rest of fields
} as any;

useAppointmentStore.getState().add(apt);
const result = useAppointmentStore.getState().getPatientAppointments(patientId);
console.log("Result length:", result.length);
console.log("Result includes apt:", result.some(r => r.id === apt.id));
