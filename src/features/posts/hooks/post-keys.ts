export const postKeys = {
  byClient: (clientId: string) => ["posts", clientId] as const,
};
