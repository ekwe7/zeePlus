import { it, expect } from "vitest";
import { useAppointmentStore } from "../appointmentStore";

it("repro", () => {
    const patientId = "00000000-0000-1000-8000-000000000000";
    const apt = {
        id: "some-id",
        patientId: patientId,
        code: "C1",
        patientName: "Name",
        date: "2025-01-01",
        time: "10:00",
        reason: "reason",
        status: "pending"
    } as any;

    useAppointmentStore.getState().add(apt);
    const result = useAppointmentStore.getState().getPatientAppointments(patientId);
    expect(result.some(r => r.id === apt.id)).toBe(true);
});
