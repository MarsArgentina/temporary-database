export declare enum AgeRange {
    unspecified = 1,
    from0to10 = 2,
    from11to15 = 3,
    from16to20 = 4,
    from21to30 = 5,
    from31to40 = 6,
    from40 = 7
}
export declare const isValidAgeRange: (value: number) => value is AgeRange;
export declare const dateToAgeRange: (date: Date) => AgeRange;
export declare const ageRangeToString: (range: number) => string;
export declare const stringAsAgeRange: (range: string) => AgeRange;
