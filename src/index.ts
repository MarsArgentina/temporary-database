import * as mongoose from "mongoose";
import {ConnectOptions as MongooseConnectOptions } from "mongoose"

export * as helpers from "./helpers"
export * as importers from "./import"

export * from "./models/user";
export * from "./models/invite";
export * from "./models/group";
export { AgeRange } from "./types/agerange";

export type ConnectOptions = MongooseConnectOptions & {
  host?: string;
  port?: string;
};

export const Database = mongoose;

export const connect = ({ host, port, ...options }: ConnectOptions = {}) => {
  host ??= process.env.MONGODB_HOST as string;
  port ??= process.env.MONGODB_PORT as string | undefined;

  if (!host) throw new Error("A host was not provided");
  const finalPort = port && port.trim() !== "" ? `:${port.trim()}` : "";

  console.log(process.env.MONGODB_USERNAME, process.env.MONGODB_PASSWORD);

  return mongoose.connect(`mongodb://${host.trim()}${finalPort}/`, {
    dbName: "tmsa",
    authSource: "tmsa",
    user: process.env.MONGODB_USERNAME?.trim(),
    pass: process.env.MONGODB_PASSWORD?.trim(),
    useNewUrlParser: true,
    useUnifiedTopology: true,
    ...options,
  });
};
