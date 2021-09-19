import { guaranteeError } from "./guaranteeError";

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

export const getRejectedResults = <T extends {} | null>(
  results: PromiseSettledResult<T | undefined>[]
): Error[] => {
  return results
    .map((result) => {
      if (result.status === "rejected") {
        return guaranteeError(result.reason);
      }

      return undefined;
    })
    .filter((value) => value !== undefined) as Error[];
};
