import { Ref, DocumentType, ReturnModelType } from "@typegoose/typegoose";
import { Types } from "mongoose";
import { Group } from "./group";
import { AddInvitesOptions, AddInvitesResult, Invite, InviteItem } from "./invite";
export declare class Event {
    name: string;
    category: string;
    invites: Ref<Invite, Types.ObjectId>[];
    groups: Ref<Group, Types.ObjectId>[];
    isHidden: boolean;
    maxGroupSize: number;
    roles: Map<string, string>;
    meta: string;
    addGroup(this: DocumentType<Event>, name: string, role: string, channels?: string[]): Promise<DocumentType<Group, import("@typegoose/typegoose/lib/types").BeAnObject>>;
    getInviteIndex(this: DocumentType<Event>, invite: Ref<Invite, Types.ObjectId>): number;
    hasInvite(this: DocumentType<Event>, invite: Ref<Invite, Types.ObjectId>): boolean;
    addInvite(this: DocumentType<Event>, email: string): Promise<[DocumentType<Invite>, boolean]>;
    addInviteList(this: DocumentType<Event>, invites: InviteItem[], options?: Partial<AddInvitesOptions>): Promise<AddInvitesResult>;
    static fetchEvent(this: ReturnModelType<typeof Event>, event: Ref<Event> | string | null): Promise<DocumentType<Event> | null>;
    static getId(this: ReturnModelType<typeof Event>, event: Ref<Event> | string | null): string | undefined;
}
export declare type EventDocument = DocumentType<Event>;
export declare const EventModel: ReturnModelType<typeof Event, import("@typegoose/typegoose/lib/types").BeAnObject>;
