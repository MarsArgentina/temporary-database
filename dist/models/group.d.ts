import { Ref, DocumentType, ReturnModelType } from "@typegoose/typegoose";
import { Types } from "mongoose";
import { Invite } from "./invite";
import { Event } from "./event";
export declare class Group {
    event: Ref<Event, Types.ObjectId>;
    members: Ref<Invite, Types.ObjectId>[];
    channels: string[];
    accessCode: string;
    role: string;
    isOpen: boolean;
    meta?: string;
    getInviteIndex(this: DocumentType<Group>, invite: Ref<Invite, Types.ObjectId>): number;
    hasInvite(this: DocumentType<Group>, invite: Ref<Invite, Types.ObjectId>): boolean;
    addInvite(this: DocumentType<Group>, invite: DocumentType<Invite>): void;
    removeInvite(this: DocumentType<Group>, invite: Ref<Invite, Types.ObjectId>): boolean;
    static fetchGroup(this: ReturnModelType<typeof Group>, group: Ref<Group> | string | null): Promise<DocumentType<Group> | null>;
    static getId(this: ReturnModelType<typeof Group>, group: Ref<Group> | string | null): string | undefined;
}
export declare type GroupDocument = DocumentType<Group>;
export declare const GroupModel: ReturnModelType<typeof Group, import("@typegoose/typegoose/lib/types").BeAnObject>;
