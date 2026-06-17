export const hospitalAdminApi = {
  verifyCode: async (code: string) => ({ valid: code.startsWith("APT-") }),
  assignDoctor: async (appointmentId: string, doctorId: string) => ({
    ok: true,
    appointmentId,
    doctorId,
  }),
};
