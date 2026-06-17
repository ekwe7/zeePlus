// Feature: patient-appointment-eligibility, Property 1: Patient appointment filtering

import { describe, it, beforeEach, expect } from "vitest";
import * as fc from "fast-check";
import { useAppointmentStore } from "../appointmentStore";
import type { Appointment } from "@/types/appointment";

/**
 * Validates: Requirements 1.1, 1.3, 3.1, 3.4
 *
 * Property 1: For any appointment store state containing appointments with mixed
 * patientId values, getPatientAppointments(id) must return only appointments where
 * patientId === id — including the empty list when no such appointments exist.
 */

// Helper to reset the Zustand store state between tests
function resetStore() {
  useAppointmentStore.setState({ appointments: [] });
}

// Arbitraries

/** Generates a non-empty alphanumeric patient ID string */
const patientIdArb = fc.stringMatching(/^[a-z0-9]{1,12}$/).filter((s) => s.length > 0);

/** Generates a valid AppointmentStatus */
const statusArb = fc.constantFrom(
  "pending" as const,
  "confirmed" as const,
  "completed" as const,
  "cancelled" as const,
);

/** Generates a valid Appointment with a given patientId */
function appointmentArb(patientId: string): fc.Arbitrary<Appointment> {
  return fc.record({
    id: fc.uuid(),
    code: fc.stringMatching(/^APT-[0-9]{4}$/),
    patientId: fc.constant(patientId),
    patientName: fc.string({ minLength: 1, maxLength: 30 }),
    doctorId: fc.option(fc.uuid(), { nil: undefined }),
    doctorName: fc.option(fc.string({ minLength: 1, maxLength: 30 }), { nil: undefined }),
    date: fc.constant("2025-01-01"),
    time: fc.constant("09:00"),
    reason: fc.string({ minLength: 1, maxLength: 100 }),
    status: statusArb,
  });
}

/** Generates a list of appointments for a given patientId (0–5 items) */
function appointmentsForPatientArb(patientId: string): fc.Arbitrary<Appointment[]> {
  return fc.array(appointmentArb(patientId), { minLength: 0, maxLength: 5 });
}

describe("appointmentStore — Property 1: Patient appointment filtering", () => {
  beforeEach(() => {
    resetStore();
  });

  it("returns only appointments matching the queried patientId, never appointments for other patients", () => {
    // Feature: patient-appointment-eligibility, Property 1: Patient appointment filtering
    fc.assert(
      fc.property(
        // Two distinct patient IDs
        patientIdArb,
        patientIdArb,
        // Appointments for each patient
        fc.integer({ min: 0, max: 5 }),
        fc.integer({ min: 0, max: 5 }),
        (patientA, patientB, countA, countB) => {
          // Ensure the two patient IDs are distinct so we can verify isolation
          fc.pre(patientA !== patientB);

          resetStore();

          const store = useAppointmentStore.getState();

          // Build appointments for patient A
          const aptsA: Appointment[] = Array.from({ length: countA }, (_, i) => ({
            id: `a-${patientA}-${i}`,
            code: `APT-${1000 + i}`,
            patientId: patientA,
            patientName: `Patient A ${i}`,
            date: "2025-01-01",
            time: "09:00",
            reason: "checkup",
            status: "pending" as const,
          }));

          // Build appointments for patient B
          const aptsB: Appointment[] = Array.from({ length: countB }, (_, i) => ({
            id: `b-${patientB}-${i}`,
            code: `APT-${2000 + i}`,
            patientId: patientB,
            patientName: `Patient B ${i}`,
            date: "2025-01-02",
            time: "10:00",
            reason: "follow-up",
            status: "confirmed" as const,
          }));

          // Add all appointments to the store
          [...aptsA, ...aptsB].forEach((apt) => store.add(apt));

          // Query for patient A
          const resultA = useAppointmentStore.getState().getPatientAppointments(patientA);

          // All returned appointments must belong to patient A
          const allBelongToA = resultA.every((apt) => apt.patientId === patientA);
          // No appointment from patient B should appear
          const noBFromA = resultA.every((apt) => apt.patientId !== patientB);
          // The count must match what was added for patient A
          const correctCount = resultA.length === countA;

          // Query for patient B
          const resultB = useAppointmentStore.getState().getPatientAppointments(patientB);

          const allBelongToB = resultB.every((apt) => apt.patientId === patientB);
          const noAFromB = resultB.every((apt) => apt.patientId !== patientA);
          const correctCountB = resultB.length === countB;

          return (
            allBelongToA && noBFromA && correctCount && allBelongToB && noAFromB && correctCountB
          );
        },
      ),
      { numRuns: 100 },
    );
  });

  it("returns an empty list when no appointments exist for the queried patientId", () => {
    // Feature: patient-appointment-eligibility, Property 1: Patient appointment filtering
    fc.assert(
      fc.property(
        patientIdArb,
        patientIdArb,
        fc.integer({ min: 1, max: 5 }),
        (targetPatient, otherPatient, count) => {
          fc.pre(targetPatient !== otherPatient);

          resetStore();

          const store = useAppointmentStore.getState();

          // Add appointments only for otherPatient
          Array.from({ length: count }, (_, i) => {
            store.add({
              id: `o-${otherPatient}-${i}`,
              code: `APT-${3000 + i}`,
              patientId: otherPatient,
              patientName: `Other Patient ${i}`,
              date: "2025-01-03",
              time: "11:00",
              reason: "routine",
              status: "pending" as const,
            });
          });

          // targetPatient has no appointments — must get empty list
          const result = useAppointmentStore.getState().getPatientAppointments(targetPatient);
          return result.length === 0;
        },
      ),
      { numRuns: 100 },
    );
  });
});

// Feature: patient-appointment-eligibility, Property 2: Appointment add round-trip

/**
 * Validates: Requirements 1.2
 *
 * Property 2: For any valid patient ID and appointment payload, after calling
 * add(appointment), getPatientAppointments(patientId) must include the newly
 * added appointment.
 */
describe("appointmentStore — Property 2: Appointment add round-trip", () => {
  beforeEach(() => {
    resetStore();
  });

  it("getPatientAppointments includes the appointment immediately after add", () => {
    // Feature: patient-appointment-eligibility, Property 2: Appointment add round-trip
    fc.assert(
      fc.property(patientIdArb, fc.integer({ min: 0, max: 4 }), (patientId, preExistingCount) => {
        resetStore();

        const store = useAppointmentStore.getState();

        // Optionally seed some pre-existing appointments for the same patient
        const preExisting: Appointment[] = Array.from({ length: preExistingCount }, (_, i) => ({
          id: `pre-${patientId}-${i}`,
          code: `APT-${5000 + i}`,
          patientId,
          patientName: `Patient ${patientId}`,
          date: "2025-01-01",
          time: "08:00",
          reason: "pre-existing",
          status: "pending" as const,
        }));
        preExisting.forEach((apt) => store.add(apt));

        // The new appointment to add
        const newApt: Appointment = {
          id: `new-${patientId}`,
          code: "APT-9999",
          patientId,
          patientName: `Patient ${patientId}`,
          date: "2025-06-15",
          time: "14:30",
          reason: "new visit",
          status: "pending" as const,
        };

        useAppointmentStore.getState().add(newApt);

        const results = useAppointmentStore.getState().getPatientAppointments(patientId);

        // The newly added appointment must appear in the results
        const found = results.some((apt) => apt.id === newApt.id);
        // The total count must be preExistingCount + 1
        const correctCount = results.length === preExistingCount + 1;

        return found && correctCount;
      }),
      { numRuns: 100 },
    );
  });

  it("add round-trip holds for arbitrary appointment payloads", () => {
    // Feature: patient-appointment-eligibility, Property 2: Appointment add round-trip
    fc.assert(
      fc.property(
        patientIdArb,
        patientIdArb.chain((pid) => appointmentArb(pid)),
        (patientId, apt) => {
          resetStore();

          // Override patientId so we can query by it
          const aptWithPatient: Appointment = { ...apt, patientId };

          useAppointmentStore.getState().add(aptWithPatient);

          const results = useAppointmentStore.getState().getPatientAppointments(patientId);

          // The appointment must be present and its fields must be intact
          const match = results.find((r) => r.id === aptWithPatient.id);
          if (!match) return false;

          return (
            match.patientId === patientId &&
            match.code === aptWithPatient.code &&
            match.reason === aptWithPatient.reason &&
            match.status === aptWithPatient.status
          );
        },
      ),
      { numRuns: 100 },
    );
  });
});

// Feature: patient-appointment-eligibility, Property 3: Admin sees all appointments

/**
 * Validates: Requirements 1.5, 1.6
 *
 * Property 3: For any set of appointments added with arbitrary patientId values,
 * getAdminAppointments() must return every appointment in the store — none are
 * filtered out.
 */
describe("appointmentStore — Property 3: Admin sees all appointments", () => {
  beforeEach(() => {
    resetStore();
  });

  it("getAdminAppointments returns every appointment regardless of patientId", () => {
    // Feature: patient-appointment-eligibility, Property 3: Admin sees all appointments
    fc.assert(
      fc.property(
        // Generate 1–5 distinct patient IDs
        fc.array(patientIdArb, { minLength: 1, maxLength: 5 }),
        // For each patient, generate 0–4 appointments
        fc.array(fc.integer({ min: 0, max: 4 }), { minLength: 1, maxLength: 5 }),
        (patientIds, counts) => {
          resetStore();

          const store = useAppointmentStore.getState();

          // Pair each patient ID with a count (zip, using the shorter length)
          const pairs = patientIds.map((pid, i) => ({
            patientId: pid,
            count: counts[i] ?? 0,
          }));

          // Build and add all appointments
          const allAdded: Appointment[] = [];
          pairs.forEach(({ patientId, count }) => {
            Array.from({ length: count }, (_, i) => {
              const apt: Appointment = {
                id: `admin-${patientId}-${i}`,
                code: `APT-${(Math.abs(patientId.charCodeAt(0) * 100 + i) % 9000) + 1000}`,
                patientId,
                patientName: `Patient ${patientId}`,
                date: "2025-03-01",
                time: "10:00",
                reason: "admin-test",
                status: "pending" as const,
              };
              store.add(apt);
              allAdded.push(apt);
            });
          });

          const adminResult = useAppointmentStore.getState().getAdminAppointments();

          // The admin view must contain exactly as many appointments as were added
          const correctCount = adminResult.length === allAdded.length;

          // Every added appointment must appear in the admin result
          const allPresent = allAdded.every((added) => adminResult.some((r) => r.id === added.id));

          return correctCount && allPresent;
        },
      ),
      { numRuns: 100 },
    );
  });

  it("getAdminAppointments returns all appointments across many distinct patients", () => {
    // Feature: patient-appointment-eligibility, Property 3: Admin sees all appointments
    fc.assert(
      fc.property(
        // Generate a list of appointments with arbitrary (possibly repeated) patientIds
        fc.array(
          fc.record({
            patientId: patientIdArb,
            index: fc.integer({ min: 0, max: 999 }),
          }),
          { minLength: 0, maxLength: 20 },
        ),
        (entries) => {
          resetStore();

          const store = useAppointmentStore.getState();

          // Deduplicate by a composite key to avoid id collisions
          const seen = new Set<string>();
          const appointments: Appointment[] = [];
          entries.forEach(({ patientId, index }) => {
            const id = `multi-${patientId}-${index}`;
            if (!seen.has(id)) {
              seen.add(id);
              appointments.push({
                id,
                code: `APT-${(index % 9000) + 1000}`,
                patientId,
                patientName: `Patient ${patientId}`,
                date: "2025-04-01",
                time: "11:00",
                reason: "multi-patient-test",
                status: "confirmed" as const,
              });
            }
          });

          appointments.forEach((apt) => store.add(apt));

          const adminResult = useAppointmentStore.getState().getAdminAppointments();

          // Admin must see every appointment that was added
          const allPresent = appointments.every((added) =>
            adminResult.some((r) => r.id === added.id),
          );

          // Admin must not see more appointments than were added
          const noExtra = adminResult.length === appointments.length;

          return allPresent && noExtra;
        },
      ),
      { numRuns: 100 },
    );
  });
});
