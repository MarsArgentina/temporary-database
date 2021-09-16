/// <reference types="node" />
import { InviteItem } from "../models/invite";
import { UserItem } from "../models/user";
export declare const parseOldData: (file: Buffer | ArrayBuffer | string) => Promise<[UserItem[], InviteItem[]]>;
declare type Overwrites = {
    role: boolean;
    inviteMeta: boolean;
    userMeta: boolean;
    name: boolean;
};
export declare const importFromParsedOldData: (users: UserItem[], invites: InviteItem[], event?: string, overwrites?: Partial<Overwrites>) => Promise<{
    users: import("@typegoose/typegoose").DocumentType<import("../models/user").User, import("@typegoose/typegoose/lib/types").BeAnObject>[];
    invites: {
        found: import("@typegoose/typegoose").DocumentType<import("../models/invite").Invite, import("@typegoose/typegoose/lib/types").BeAnObject>[];
        created: import("@typegoose/typegoose").DocumentType<import("../models/invite").Invite, import("@typegoose/typegoose/lib/types").BeAnObject>[];
        error: {
            email: string;
            error: Error;
        }[];
        deactivated: number;
    };
}>;
export declare const importFromOldData: (file: Buffer | ArrayBuffer | string, event?: string, overwrites?: Partial<Overwrites>) => Promise<{
    users: import("@typegoose/typegoose").DocumentType<import("../models/user").User, import("@typegoose/typegoose/lib/types").BeAnObject>[];
    invites: {
        found: import("@typegoose/typegoose").DocumentType<import("../models/invite").Invite, import("@typegoose/typegoose/lib/types").BeAnObject>[];
        created: import("@typegoose/typegoose").DocumentType<import("../models/invite").Invite, import("@typegoose/typegoose/lib/types").BeAnObject>[];
        error: {
            email: string;
            error: Error;
        }[];
        deactivated: number;
    };
}>;
export {};
