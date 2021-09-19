import { Ref, DocumentType, ReturnModelType } from "@typegoose/typegoose";
import { Types } from "mongoose";
import { Invite } from "./invite";
export declare class Group {
    event: string;
    members: Ref<Invite, Types.ObjectId>[];
    channels: string[];
    isOpen: boolean;
    meta?: string;
    getInviteIndex(this: DocumentType<Group>, invite: Ref<Invite, Types.ObjectId>): number;
    hasInvite(this: DocumentType<Group>, invite: Ref<Invite, Types.ObjectId>): boolean;
    addInvite(this: DocumentType<Group>, invite: Ref<Invite, Types.ObjectId>): void;
    removeInvite(this: DocumentType<Group>, invite: Ref<Invite, Types.ObjectId>): boolean;
    static fetchGroup(this: ReturnModelType<typeof Group>, group: Ref<Group, Types.ObjectId>): Promise<DocumentType<Group, import("@typegoose/typegoose/lib/types").BeAnObject> | null>;
}
export declare type GroupDocument = DocumentType<Group>;
export declare const GroupModel: ReturnModelType<typeof Group, import("@typegoose/typegoose/lib/types").BeAnObject>;
