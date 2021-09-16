/// <reference types="node" />
import { AddInvitesOptions, InviteItem } from "../models/invite";
export declare const parseNSAC: (file: Buffer | ArrayBuffer | string) => Promise<InviteItem[]>;
export declare const importFromNSAC: (file: Buffer | ArrayBuffer | string, event: string, role: string, options: Partial<AddInvitesOptions>) => Promise<{
    found: import("@typegoose/typegoose").DocumentType<import("../models/invite").Invite, import("@typegoose/typegoose/lib/types").BeAnObject>[];
    created: import("@typegoose/typegoose").DocumentType<import("../models/invite").Invite, import("@typegoose/typegoose/lib/types").BeAnObject>[];
    error: {
        email: string;
        error: Error;
    }[];
    deactivated: number;
}>;
