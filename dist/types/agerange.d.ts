export declare enum AgeRange {
    unspecified = 1,
    from0to10 = 2,
    from11to15 = 3,
    from16to20 = 4,
    from21to30 = 5,
    from31to40 = 6
}
export declare const isValidAgeRange: (value: number) => value is AgeRange;
