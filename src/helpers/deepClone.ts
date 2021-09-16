import { deserialize, serialize } from "v8";

export const deepClone = <T>(obj: T): T => {
  return deserialize(serialize(obj));
};
