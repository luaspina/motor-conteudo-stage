export const dnaKeys = {
  byClient: (clientId: string) => ["dna", clientId] as const,
};
