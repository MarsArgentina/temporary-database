/// <reference types="node" />
import { EventDocument } from "..";
export declare type GroupInfo = {
    name: string;
    channels: string[];
    role: string;
    invites: {
        email: string;
    }[];
    meta?: {};
};
export declare const parseOldGroups: (file: Buffer | ArrayBuffer | string) => GroupInfo[];
export declare const importGroupInfo: (event: EventDocument, info: GroupInfo[]) => Promise<void>;
export declare const importOldGroups: (event: EventDocument, file: Buffer | ArrayBuffer | string) => Promise<void>;
