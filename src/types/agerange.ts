export enum AgeRange {
  unspecified = 1,
  from0to10,
  from11to15,
  from16to20,
  from21to30,
  from31to40,
}

export const isValidAgeRange = (value: number): value is AgeRange => {
  return !!AgeRange[value];
};
