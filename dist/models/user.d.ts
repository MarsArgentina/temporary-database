/// <reference types="mongoose" />
import { Ref, DocumentType, ReturnModelType } from "@typegoose/typegoose";
import { AgeRange } from "../types/agerange";
import { Invite, InviteDocument } from "./invite";
import { Event } from "./event";
export declare type AddUsersOptions = {
    overwriteName: boolean;
    overwriteMeta: boolean;
};
export declare type UserItem = {
    id: string;
    displayName: string;
    invite: string;
    meta?: string;
};
export declare class User {
    discordId: string;
    name: string;
    displayName?: string;
    inDiscord: boolean;
    isUpdating?: boolean;
    ageRange?: AgeRange;
    roles: string[];
    unresolvedInvites: Map<string, string>;
    meta?: string;
    resolvedInvites: Map<string, string>;
    isValidated(this: DocumentType<User>): Promise<boolean | undefined>;
    getAllRoles(this: DocumentType<User>): Promise<string[]>;
    revokeInvite(this: DocumentType<User>, event: Ref<Event> | string): Promise<DocumentType<Invite, import("@typegoose/typegoose/lib/types").BeAnObject> | null>;
    forcedResolveInvite(this: DocumentType<User>, event: Ref<Event> | string, invite: Ref<Invite> | string): Promise<void>;
    resolveInvite(this: DocumentType<User>, event: Ref<Event> | string, forceRevoke?: boolean): Promise<DocumentType<Invite, import("@typegoose/typegoose/lib/types").BeAnObject> | null>;
    setInvite(this: DocumentType<User>, event: Ref<Event> | string, email?: string): Promise<readonly [DocumentType<Invite, import("@typegoose/typegoose/lib/types").BeAnObject> | null, DocumentType<Invite, import("@typegoose/typegoose/lib/types").BeAnObject> | null] | undefined>;
    getInvite(this: DocumentType<User>, event: string | Ref<Event>, unresolved?: boolean): Promise<null | InviteDocument | string>;
    getInvite(this: DocumentType<User>, event: string | Ref<Event>, unresolved?: false): Promise<null | InviteDocument>;
    getInvite(this: DocumentType<User>, event: string | Ref<Event>, unresolved: true): Promise<null | string>;
    static createFromDiscord(this: ReturnModelType<typeof User>, user: {
        id: string;
        displayName: string;
    }): Promise<DocumentType<User, import("@typegoose/typegoose/lib/types").BeAnObject>>;
    static startUpdate(this: ReturnModelType<typeof User>): Promise<import("mongoose").UpdateWriteOpResult>;
    static finishUpdate(this: ReturnModelType<typeof User>): Promise<import("mongoose").UpdateWriteOpResult>;
    static findFromDiscord(this: ReturnModelType<typeof User>, discordId: string): import("mongoose").QueryWithHelpers<DocumentType<User, import("@typegoose/typegoose/lib/types").BeAnObject> | null, DocumentType<User, import("@typegoose/typegoose/lib/types").BeAnObject>, import("@typegoose/typegoose/lib/types").BeAnObject, DocumentType<User, import("@typegoose/typegoose/lib/types").BeAnObject>>;
    static addFromDiscord(this: ReturnModelType<typeof User>, user: {
        id: string;
        displayName: string;
    }): Promise<readonly [DocumentType<User, import("@typegoose/typegoose/lib/types").BeAnObject>, boolean]>;
    static addUsersFromPastEvent(event: Ref<Event> | string, users: UserItem[], options?: Partial<AddUsersOptions>): Promise<PromiseSettledResult<DocumentType<User, import("@typegoose/typegoose/lib/types").BeAnObject>>[]>;
    static findByUnresolvedInvite(this: ReturnModelType<typeof User>, event: Ref<Event> | string, email: string): Promise<DocumentType<User, import("@typegoose/typegoose/lib/types").BeAnObject> | null>;
    static fetchUser(this: ReturnModelType<typeof User>, user: Ref<User> | string | null): Promise<DocumentType<User> | null>;
    static getId(this: ReturnModelType<typeof User>, user: Ref<User> | string | null): string | undefined;
}
export declare type UserDocument = DocumentType<User>;
export declare const UserModel: ReturnModelType<typeof User, import("@typegoose/typegoose/lib/types").BeAnObject>;
