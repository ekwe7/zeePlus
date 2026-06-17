export const pharmacistApi = {
  validateOTP: async (code: string) => ({ valid: code.length === 6 }),
  dispense: async (id: string) => ({ ok: true, id }),
};
