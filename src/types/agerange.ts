export enum AgeRange {
  unspecified = 1,
  from0to10,
  from11to15,
  from16to20,
  from21to30,
  from31to40,
  from40,
}

export const isValidAgeRange = (value: number): value is AgeRange => {
  return (
    value >= AgeRange.unspecified &&
    value <= AgeRange.from40 &&
    !!AgeRange[value]
  );
};

const AGE_RANGE = [
  "No especificado",
  "0 - 10",
  "11 - 15",
  "16 - 20",
  "21 - 30",
  "31 - 40",
  "40+",
];
const MIN_AGES = [0, 11, 16, 21, 31, 40];

export const dateToAgeRange = (date: Date) => {
  const ageDifMs =
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - Date.now();
  const ageDate = new Date(ageDifMs);
  const age = Math.abs(ageDate.getUTCFullYear() - 1970);

  const range = 7 - MIN_AGES.reverse().findIndex((min) => age > min);

  if (isValidAgeRange(range)) return range;
  return AgeRange.unspecified;
};

export const ageRangeToString = (range: number) => {
  if (isValidAgeRange(range)) {
    return AGE_RANGE[range - 1];
  } else {
    return "No especificado";
  }
};

export const stringAsAgeRange = (range: string) => {
  let num = Number(range);

  if (!isNaN(num) && isValidAgeRange(num = Math.floor(num)))
    return num;

  return AgeRange.unspecified;
};
