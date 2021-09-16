export const guaranteeError = (error: unknown): Error => {
  return error instanceof Error
    ? error
    : new Error(typeof error === "string" ? error : "Unknown error");
};
