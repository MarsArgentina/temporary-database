export const getFulfilledResults = <T extends {} | null>(
  results: PromiseSettledResult<T | undefined>[]
): T[] => {
  return results
    .map((result) => {
      if (result.status === "fulfilled") {
        return result.value;
      }

      return undefined;
    })
    .filter((value) => value !== undefined) as T[];
};
