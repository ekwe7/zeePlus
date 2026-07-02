export const reportApi = {
  generate: async (type: string) => ({
    ok: true,
    type,
    generatedAt: new Date().toISOString(),
  }),
};
