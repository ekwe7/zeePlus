export const appointmentApi = {
  book: async (payload: unknown) => ({ ok: true, payload }),
  cancel: async (id: string) => ({ ok: true, id }),
};
