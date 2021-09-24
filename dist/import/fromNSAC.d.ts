/// <reference types="node" />
import { EventDocument } from "../models/event";
import { AddInvitesOptions, InviteItem } from "../models/invite";
export declare const parseNSAC: (file: Buffer | ArrayBuffer | string) => Promise<InviteItem[]>;
export declare const importFromNSAC: (event: EventDocument, file: Buffer | ArrayBuffer | string, options: Partial<AddInvitesOptions>) => Promise<import("../models/invite").AddInvitesResult>;
