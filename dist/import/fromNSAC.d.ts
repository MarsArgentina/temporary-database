/// <reference types="node" />
import { AddInvitesOptions, InviteItem } from "../models/invite";
export declare const parseNSAC: (file: Buffer | ArrayBuffer | string) => Promise<InviteItem[]>;
export declare const importFromNSAC: (file: Buffer | ArrayBuffer | string, event: string, role: string, options: Partial<AddInvitesOptions>) => Promise<import("../models/invite").AddInvitesResult>;
