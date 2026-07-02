import { describe, it, expect, beforeEach } from "vitest";
import * as fc from "fast-check";
import { useAppointmentStore } from "../appointmentStore";
import { useUserAccountsStore } from "../userAccountsStore";
import type { Appointment } from "@/types/appointment";
import type { Role } from "@/constants/roles";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const APPOINTMENT_INITIAL_STATE = { appointments: [] };

const DEFAULT_ADMIN = {
  id: "admin-seed",
  name: "Admin",
  email: "admin@mediflow.com",
  password: "admin1234",
  role: "admin" as Role,
  createdAt: new Date().toISOString(),
  createdBy: "system",
};

function resetAppointmentStore() {
  useAppointmentStore.setState(APPOINTMENT_INITIAL_STATE);
}

function resetUserAccountsStore() {
  useUserAccountsStore.setState({ users: [DEFAULT_ADMIN] });
}

// Arbitrary for a valid Appointment record
const appointmentArb = (patientId?: string) =>
  fc.record({
    id: fc.uuid(),
    code: fc.string({ minLength: 1, maxLength: 20 }),
    patientId: patientId !== undefined ? fc.constant(patientId) : fc.uuid(),
    patientName: fc.string({ minLength: 1, maxLength: 50 }),
    doctorId: fc.option(fc.uuid(), { nil: undefined }),
    doctorName: fc.option(fc.string({ minLength: 1, maxLength: 50 }), {
      nil: undefined,
    }),
    date: fc.constant("2025-01-01"),
    time: fc.constant("10:00"),
    reason: fc.string({ minLength: 1, maxLength: 100 }),
    status: fc.constantFrom(
      "pending",
      "confirmed",
      "completed",
      "cancelled",
    ) as fc.Arbitrary<"pending" | "confirmed" | "completed" | "cancelled">,
  });

// Arbitrary for a valid patient CreateUserPayload
const patientPayloadArb = fc.record({
  name: fc.string({ minLength: 1, maxLength: 50 }),
  email: fc.emailAddress(),
  password: fc.string({ minLength: 1, maxLength: 50 }),
  role: fc.constant("patient" as Role),
  createdBy: fc.constant("admin-seed"),
});

// ---------------------------------------------------------------------------
// Property 1: getPatientAppointments filters by patientId
// Feature: patient-appointment-eligibility, Property 1: Patient appointment filtering
// Validates: Requirements 1.1, 1.3, 3.1, 3.4
// ---------------------------------------------------------------------------
describe("Property 1: Patient appointment filtering", () => {
  beforeEach(resetAppointmentStore);

  it("getPatientAppointments returns only appointments matching the given patientId", () => {
    fc.assert(
      fc.property(
        fc.uuid(), // the target patientId
        fc.array(appointmentArb(), { minLength: 0, maxLength: 20 }),
        (targetId, appointments) => {
          resetAppointmentStore();

          // Populate the store
          const { add, getPatientAppointments } =
            useAppointmentStore.getState();
          for (const apt of appointments) {
            add(apt as Appointment);
          }

          const result = getPatientAppointments(targetId);

          // Every returned appointment must belong to targetId
          const allMatch = result.every((apt) => apt.patientId === targetId);
          // Every appointment in the store with targetId must be in the result
          const allIncluded = appointments
            .filter((apt) => apt.patientId === targetId)
            .every((apt) => result.some((r) => r.id === apt.id));

          return allMatch && allIncluded;
        },
      ),
      { numRuns: 100 },
    );
  });
});

// ---------------------------------------------------------------------------
// Property 2: add then getPatientAppointments round-trip
// Feature: patient-appointment-eligibility, Property 2: Appointment add round-trip
// Validates: Requirements 1.2
// ---------------------------------------------------------------------------
describe("Property 2: Appointment add round-trip", () => {
  beforeEach(resetAppointmentStore);

  it("after add(appointment), getPatientAppointments includes the new appointment", () => {
    fc.assert(
      fc.property(fc.uuid(), (patientId) => {
        const aptArb = appointmentArb(patientId);
        // Instead of nesting properties, we can sample one from the arbitrary
        // but it's better to use a single property with tuple if possible.
        // However, for simplicity and to fix the immediate issue:
        return fc.sample(aptArb, 1).every((apt) => {
          resetAppointmentStore();

          const { add, getPatientAppointments } =
            useAppointmentStore.getState();
          add(apt as Appointment);

          const result = getPatientAppointments(patientId);
          return result.some((r) => r.id === apt.id);
        });
      }),
      { numRuns: 100 },
    );
  });
});

// ---------------------------------------------------------------------------
// Property 3: getAdminAppointments returns all
// Feature: patient-appointment-eligibility, Property 3: Admin sees all appointments
// Validates: Requirements 1.5, 1.6
// ---------------------------------------------------------------------------
describe("Property 3: Admin sees all appointments", () => {
  beforeEach(resetAppointmentStore);

  it("getAdminAppointments returns every appointment regardless of patientId", () => {
    fc.assert(
      fc.property(
        fc.array(appointmentArb(), { minLength: 0, maxLength: 20 }),
        (appointments) => {
          resetAppointmentStore();

          const { add, getAdminAppointments } = useAppointmentStore.getState();
          for (const apt of appointments) {
            add(apt as Appointment);
          }

          const result = getAdminAppointments();

          // All added appointments must appear in admin view
          return appointments.every((apt) =>
            result.some((r) => r.id === apt.id),
          );
        },
      ),
      { numRuns: 100 },
    );
  });
});

// ---------------------------------------------------------------------------
// Property 4: createUser with patient role always sets eligibilityPlan to "BASIC"
// Feature: patient-appointment-eligibility, Property 4: New patient gets BASIC plan
// Validates: Requirements 2.1, 2.2
// ---------------------------------------------------------------------------
describe("Property 4: New patient gets BASIC plan", () => {
  beforeEach(resetUserAccountsStore);

  it("createUser with role=patient always produces eligibilityPlan === BASIC", () => {
    fc.assert(
      fc.property(patientPayloadArb, (payload) => {
        resetUserAccountsStore();

        const { createUser, users } = useUserAccountsStore.getState();
        const result = createUser(payload);

        if (!result.success) {
          // Email collision — skip this sample (shouldn't happen after reset)
          return true;
        }

        const created = useUserAccountsStore
          .getState()
          .users.find((u) => u.email === payload.email);

        return created !== undefined && created.eligibilityPlan === "BASIC";
      }),
      { numRuns: 100 },
    );
  });
});

// ---------------------------------------------------------------------------
// Property 5: updateEligibilityPlan valid-value round-trip
// Feature: patient-appointment-eligibility, Property 5: Plan update round-trip
// Validates: Requirements 2.3, 2.4, 2.5, 2.7
// ---------------------------------------------------------------------------
describe("Property 5: Plan update round-trip", () => {
  beforeEach(resetUserAccountsStore);

  it("after updateEligibilityPlan with a valid plan, the stored plan equals the new value", () => {
    fc.assert(
      fc.property(fc.constantFrom("BASIC", "PREMIUM", "EXPIRED"), (plan) => {
        resetUserAccountsStore();

        // Create a patient first
        const { createUser, updateEligibilityPlan } =
          useUserAccountsStore.getState();
        const email = `patient-${Date.now()}-${Math.random()}@test.com`;
        createUser({
          name: "Test Patient",
          email,
          password: "pass123",
          role: "patient",
          createdBy: "admin-seed",
        });

        const patient = useUserAccountsStore
          .getState()
          .users.find((u) => u.email === email);
        if (!patient) return false;

        const updateResult = updateEligibilityPlan(patient.id, plan);
        if (!updateResult.success) return false;

        const updated = useUserAccountsStore
          .getState()
          .users.find((u) => u.id === patient.id);
        return updated?.eligibilityPlan === plan;
      }),
      { numRuns: 100 },
    );
  });
});

// ---------------------------------------------------------------------------
// Property 6: updateEligibilityPlan rejects invalid plan strings
// Feature: patient-appointment-eligibility, Property 6: Invalid plan values are rejected
// Validates: Requirements 2.6
// ---------------------------------------------------------------------------
describe("Property 6: Invalid plan values are rejected", () => {
  beforeEach(resetUserAccountsStore);

  it("updateEligibilityPlan returns { success: false } for any non-valid plan string", () => {
    const validPlans = new Set(["BASIC", "PREMIUM", "EXPIRED"]);

    fc.assert(
      fc.property(
        fc.string().filter((s) => !validPlans.has(s)),
        (invalidPlan) => {
          resetUserAccountsStore();

          // Create a patient to have a valid userId
          const { createUser, updateEligibilityPlan } =
            useUserAccountsStore.getState();
          const email = `patient-${Date.now()}-${Math.random()}@test.com`;
          createUser({
            name: "Test Patient",
            email,
            password: "pass123",
            role: "patient",
            createdBy: "admin-seed",
          });

          const patient = useUserAccountsStore
            .getState()
            .users.find((u) => u.email === email);
          if (!patient) return false;

          const originalPlan = patient.eligibilityPlan;
          const result = updateEligibilityPlan(patient.id, invalidPlan);

          // Must return failure
          if (result.success !== false) return false;

          // Plan must be unchanged
          const afterUpdate = useUserAccountsStore
            .getState()
            .users.find((u) => u.id === patient.id);
          return afterUpdate?.eligibilityPlan === originalPlan;
        },
      ),
      { numRuns: 100 },
    );
  });
});

// ---------------------------------------------------------------------------
// Unit test 4.7: store initialises with empty appointments list
// ---------------------------------------------------------------------------
describe("Unit: appointmentStore initialisation", () => {
  beforeEach(resetAppointmentStore);

  it("initialises with appointments: []", () => {
    resetAppointmentStore();
    const { appointments } = useAppointmentStore.getState();
    expect(appointments).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// Unit test 4.8: createUser with non-patient role does not set eligibilityPlan
// ---------------------------------------------------------------------------
describe("Unit: createUser non-patient role", () => {
  beforeEach(resetUserAccountsStore);

  it("doctor role — no eligibilityPlan field", () => {
    const { createUser } = useUserAccountsStore.getState();
    createUser({
      name: "Dr Smith",
      email: "drsmith@test.com",
      password: "pass123",
      role: "doctor",
      createdBy: "admin-seed",
    });
    const user = useUserAccountsStore
      .getState()
      .users.find((u) => u.email === "drsmith@test.com");
    expect(user).toBeDefined();
    expect(user?.eligibilityPlan).toBeUndefined();
  });

  it("pharmacist role — no eligibilityPlan field", () => {
    const { createUser } = useUserAccountsStore.getState();
    createUser({
      name: "Pharma Joe",
      email: "pharmajoe@test.com",
      password: "pass123",
      role: "pharmacist",
      createdBy: "admin-seed",
    });
    const user = useUserAccountsStore
      .getState()
      .users.find((u) => u.email === "pharmajoe@test.com");
    expect(user).toBeDefined();
    expect(user?.eligibilityPlan).toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// Unit test 4.9: updateEligibilityPlan with unknown userId returns error
// ---------------------------------------------------------------------------
describe("Unit: updateEligibilityPlan unknown userId", () => {
  beforeEach(resetUserAccountsStore);

  it("returns { success: false, error: 'User not found' } for a non-existent userId", () => {
    const { updateEligibilityPlan } = useUserAccountsStore.getState();
    const result = updateEligibilityPlan("non-existent-id-12345", "BASIC");
    expect(result).toEqual({ success: false, error: "User not found" });
  });
});
