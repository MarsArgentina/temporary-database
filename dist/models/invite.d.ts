import { Ref, DocumentType, ReturnModelType } from "@typegoose/typegoose";
import { Types } from "mongoose";
import { User } from "./user";
import { Group } from "./group";
export declare type RevokeInviteOptions = {
    revokeFromUser?: boolean;
    returnUser?: boolean;
};
export declare type AddInvitesOptions = {
    addRole: boolean;
    deactivateMissing: boolean;
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
    event: string;
    email: string;
    role: string[];
    meta?: string;
    user?: Ref<User, Types.ObjectId>;
    group?: Ref<Group, Types.ObjectId>;
    assignToGroup(this: DocumentType<Invite>, group: Ref<Group>): Promise<boolean>;
    revoke(this: DocumentType<Invite>, options?: RevokeInviteOptions): Promise<DocumentType<User, import("@typegoose/typegoose/lib/types").BeAnObject> | null>;
    resolve(this: DocumentType<Invite>, user: DocumentType<User>, forceRevoke?: boolean): Promise<void>;
    isEqual(this: DocumentType<Invite>, invite: Ref<Invite, Types.ObjectId>): boolean;
    setRole(this: DocumentType<Invite>, role: string, add?: boolean): Promise<void>;
    static getId(this: ReturnModelType<typeof Invite>, invite: Ref<Invite>): Types.ObjectId | undefined;
    static findExact(this: ReturnModelType<typeof Invite>, event: string, email: string): import("mongoose").QueryWithHelpers<DocumentType<Invite, import("@typegoose/typegoose/lib/types").BeAnObject> | null, DocumentType<Invite, import("@typegoose/typegoose/lib/types").BeAnObject>, import("@typegoose/typegoose/lib/types").BeAnObject, DocumentType<Invite, import("@typegoose/typegoose/lib/types").BeAnObject>>;
    static addInvite(this: ReturnModelType<typeof Invite>, event: string, email: string): Promise<[DocumentType<Invite>, boolean]>;
    static addInviteList(this: ReturnModelType<typeof Invite>, event: string, invites: InviteItem[], role: string, options?: Partial<AddInvitesOptions>): Promise<AddInvitesResult>;
    static fetchInvite(this: ReturnModelType<typeof Invite>, invite: Ref<Invite, Types.ObjectId>): Promise<DocumentType<Invite, import("@typegoose/typegoose/lib/types").BeAnObject> | undefined>;
    static fetchAllInvites(this: ReturnModelType<typeof Invite>, invites: Ref<Invite, Types.ObjectId>[]): Promise<DocumentType<Invite, import("@typegoose/typegoose/lib/types").BeAnObject>[]>;
}
export declare type InviteDocument = DocumentType<Invite>;
export declare const InviteModel: ReturnModelType<typeof Invite, import("@typegoose/typegoose/lib/types").BeAnObject>;
