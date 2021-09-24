/// <reference types="node" />
import { InviteItem } from "../models/invite";
import { UserDocument, UserItem } from "../models/user";
import { EventDocument } from "../models/event";
export declare const parseOldData: (file: Buffer | ArrayBuffer | string) => Promise<[UserItem[], InviteItem[]]>;
export declare type Overwrites = {
    role: boolean;
    inviteMeta: boolean;
    userMeta: boolean;
    name: boolean;
};
export declare const importFromParsedOldData: (event: EventDocument, users: UserItem[], invites: InviteItem[], overwrites?: Partial<Overwrites>) => Promise<{
    users: UserDocument[];
    invites: import("../models/invite").AddInvitesResult;
}>;
export declare const importFromOldData: (event: EventDocument, file: Buffer | ArrayBuffer | string, overwrites?: Partial<Overwrites>) => Promise<{
    users: UserDocument[];
    invites: import("../models/invite").AddInvitesResult;
}>;
