export declare const getFulfilledResults: <T extends {} | null>(results: PromiseSettledResult<T | undefined>[]) => T[];
export declare const getRejectedResults: <T extends {} | null>(results: PromiseSettledResult<T | undefined>[]) => Error[];
