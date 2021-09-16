import * as mongoose from "mongoose";
import { ConnectOptions as MongooseConnectOptions } from "mongoose";
export * as helpers from "./helpers";
export * as importers from "./import";
export * from "./models/user";
export * from "./models/invite";
export * from "./models/group";
export { AgeRange } from "./types/agerange";
export declare type ConnectOptions = MongooseConnectOptions & {
    host?: string;
    port?: string;
};
export declare const Database: typeof mongoose;
export declare const connect: ({ host, port, ...options }?: ConnectOptions) => Promise<typeof mongoose>;
