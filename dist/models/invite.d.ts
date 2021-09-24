import { Ref, DocumentType, ReturnModelType } from "@typegoose/typegoose";
import { Types } from "mongoose";
import { User } from "./user";
import { Group } from "./group";
import { Event } from "./event";
export declare type RevokeInviteOptions = {
    revokeFromUser?: boolean;
    returnUser?: boolean;
};
export declare type AddInvitesOptions = {
    role: string;
    deactivateMissing: boolean;
    overwriteRole: boolean;
    overwriteMeta: boolean;
};
export declare type AddInvitesResult = {
    found: InviteDocument[];
    created: InviteDocument[];
    error: {
        email: string;
        error: Error;
    }[];
    deactivated: number;
};
export declare type InviteItem = {
    email: string;
    meta?: string;
    role?: string;
};
export declare class Invite {
    active: boolean;
    email: string;
    roles: string[];
    certificate: string;
    meta?: string;
    event: Ref<Event, Types.ObjectId>;
    user?: Ref<User, Types.ObjectId>;
    group?: Ref<Group, Types.ObjectId>;
    assignToGroup(this: DocumentType<Invite>, group: Ref<Group>): Promise<boolean>;
    revoke(this: DocumentType<Invite>, options?: RevokeInviteOptions): Promise<DocumentType<User, import("@typegoose/typegoose/lib/types").BeAnObject> | null>;
    resolve(this: DocumentType<Invite>, user: DocumentType<User>, forceRevoke?: boolean): Promise<void>;
    getAllRoles(this: DocumentType<Invite>): Promise<string[]>;
    setRole(this: DocumentType<Invite>, role: string, add?: boolean): Promise<void>;
    static findExact(this: ReturnModelType<typeof Invite>, event: Ref<Event> | string, email: string): import("mongoose").QueryWithHelpers<DocumentType<Invite, import("@typegoose/typegoose/lib/types").BeAnObject> | null, DocumentType<Invite, import("@typegoose/typegoose/lib/types").BeAnObject>, import("@typegoose/typegoose/lib/types").BeAnObject, DocumentType<Invite, import("@typegoose/typegoose/lib/types").BeAnObject>> | null;
    static fetchAllInvites(this: ReturnModelType<typeof Invite>, invites: (Ref<Invite, Types.ObjectId> | string)[]): Promise<(DocumentType<Invite, import("@typegoose/typegoose/lib/types").BeAnObject> | null)[]>;
    static fetchInvite(this: ReturnModelType<typeof Invite>, invite: Ref<Invite> | string | null): Promise<DocumentType<Invite> | null>;
    static getId(this: ReturnModelType<typeof Invite>, invite: Ref<Invite> | string | null): string | undefined;
}
export declare type InviteDocument = DocumentType<Invite>;
export declare const InviteModel: ReturnModelType<typeof Invite, import("@typegoose/typegoose/lib/types").BeAnObject>;
