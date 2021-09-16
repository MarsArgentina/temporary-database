import { Ref, DocumentType, ReturnModelType } from "@typegoose/typegoose";
import { Types } from "mongoose";
import { AgeRange } from "../types/agerange";
import { Invite } from "./invite";
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
    inDiscord: boolean;
    ageRange?: AgeRange;
    roles: string[];
    unresolvedInvites: Map<string, string>;
    meta?: string;
    resolvedInvites: Ref<Invite, Types.ObjectId>[];
    isValidated(this: DocumentType<User>): Promise<boolean | undefined>;
    revokeInvite(this: DocumentType<User>, event: string): Promise<DocumentType<Invite, import("@typegoose/typegoose/lib/types").BeAnObject> | null>;
    forcedResolveInvite(this: DocumentType<User>, invite: DocumentType<Invite>): Promise<void>;
    resolveInvite(this: DocumentType<User>, event: string, forceRevoke?: boolean): Promise<DocumentType<Invite, import("@typegoose/typegoose/lib/types").BeAnObject> | null>;
    setInvite(this: DocumentType<User>, event: string, email?: string): Promise<readonly [DocumentType<Invite, import("@typegoose/typegoose/lib/types").BeAnObject> | null, DocumentType<Invite, import("@typegoose/typegoose/lib/types").BeAnObject> | null] | undefined>;
    getInvite(this: DocumentType<User>, event: string, unresolved?: boolean): Promise<null | Invite | string>;
    getInvite(this: DocumentType<User>, event: string, unresolved?: false): Promise<null | Invite>;
    getInvite(this: DocumentType<User>, event: string, unresolved: true): Promise<null | string>;
    static createFromDiscord(this: ReturnModelType<typeof User>, user: {
        id: string;
        displayName: string;
    }): Promise<DocumentType<User, import("@typegoose/typegoose/lib/types").BeAnObject>>;
    static findFromDiscord(this: ReturnModelType<typeof User>, user: {
        id: string;
        displayName: string;
    }): import("mongoose").QueryWithHelpers<DocumentType<User, import("@typegoose/typegoose/lib/types").BeAnObject> | null, DocumentType<User, import("@typegoose/typegoose/lib/types").BeAnObject>, import("@typegoose/typegoose/lib/types").BeAnObject, DocumentType<User, import("@typegoose/typegoose/lib/types").BeAnObject>>;
    static addFromDiscord(this: ReturnModelType<typeof User>, user: {
        id: string;
        displayName: string;
    }): Promise<readonly [DocumentType<User, import("@typegoose/typegoose/lib/types").BeAnObject>, boolean]>;
    static addUserList(event: string, users: UserItem[], options?: Partial<AddUsersOptions>): Promise<PromiseSettledResult<DocumentType<User, import("@typegoose/typegoose/lib/types").BeAnObject>>[]>;
    static fetchUser(this: ReturnModelType<typeof User>, user: Ref<User, Types.ObjectId>): Promise<DocumentType<User> | null>;
    static findByUnresolvedInvite(this: ReturnModelType<typeof User>, event: string, email: string): Promise<DocumentType<User, import("@typegoose/typegoose/lib/types").BeAnObject> | null>;
}
export declare const UserModel: ReturnModelType<typeof User, import("@typegoose/typegoose/lib/types").BeAnObject>;
