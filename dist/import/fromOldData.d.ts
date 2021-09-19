/// <reference types="node" />
import { InviteItem } from "../models/invite";
import { UserDocument, UserItem } from "../models/user";
export declare const parseOldData: (file: Buffer | ArrayBuffer | string) => Promise<[UserItem[], InviteItem[]]>;
export declare type Overwrites = {
    role: boolean;
    inviteMeta: boolean;
    userMeta: boolean;
    name: boolean;
};
export declare const importFromParsedOldData: (users: UserItem[], invites: InviteItem[], event?: string, overwrites?: Partial<Overwrites>) => Promise<{
    users: UserDocument[];
    invites: import("../models/invite").AddInvitesResult;
}>;
export declare const importFromOldData: (file: Buffer | ArrayBuffer | string, event?: string, overwrites?: Partial<Overwrites>) => Promise<{
    users: UserDocument[];
    invites: import("../models/invite").AddInvitesResult;
}>;
