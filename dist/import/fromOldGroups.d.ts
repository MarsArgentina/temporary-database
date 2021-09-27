import { EventDocument } from "../models/event";
export declare type GroupInfo = {
    name: string;
    channels: string[];
    role: string;
    invites: string[];
    meta?: {};
};
export declare const importOldGroups: (event: EventDocument, info: GroupInfo[]) => Promise<void>;
