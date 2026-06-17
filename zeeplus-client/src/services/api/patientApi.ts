// Mock API — replace with real HTTP calls
export const patientApi = {
  getProfile: async (id: string) => ({ id, name: "Jane Doe", plan: "PREMIUM" }),
};
