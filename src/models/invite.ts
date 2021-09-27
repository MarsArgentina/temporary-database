import {
  getModelForClass,
  prop,
  index,
  Ref,
  isDocument,
  DocumentType,
  ReturnModelType,
} from "@typegoose/typegoose";
import { Types } from "mongoose";
import { User, UserModel } from "./user";
import { Group, GroupModel } from "./group";
import { Event, EventModel } from "./event";
import { getFulfilledResults } from "../helpers/getResults";
import { generate as passwordGenerator } from "generate-password";

export type RevokeInviteOptions = {
  revokeFromUser?: boolean;
  returnUser?: boolean;
};

export type AddInvitesOptions = {
  role: string;
  deactivateMissing: boolean;
  overwriteRole: boolean;
  overwriteMeta: boolean;
};

export type AddInvitesResult = {
  found: InviteDocument[];
  created: InviteDocument[];
  error: { email: string; error: Error }[];
  deactivated: number;
};

export type InviteItem = { email: string; meta?: {}; role?: string };

@index({ event: 1, email: 1 }, { unique: true })
export class Invite {
  @prop({ required: true, default: true })
  public active!: boolean;

  @prop({ required: true })
  public email!: string;

  @prop({
    type: String,
    required: true,
    default: () => ["participant"],
    minlength: 1,
  })
  public roles!: string[];

  @prop({
    required: true,
    unique: true,
    default: () =>
      passwordGenerator({
        length: 10,
        uppercase: true,
        lowercase: false,
        numbers: true,
        symbols: false,
      }),
  })
  public certificate!: string;

  @prop({default: "{}"})
  public meta!: string;

  @prop({ ref: () => "Event", required: true })
  public event!: Ref<Event, Types.ObjectId>;

  @prop({ ref: () => "User" })
  public user?: Ref<User, Types.ObjectId>;

  @prop({ ref: () => "Group" })
  public group?: Ref<Group, Types.ObjectId>;

  public async assignToGroup(this: DocumentType<Invite>, group: Ref<Group>) {
    if (this.group) {
      const fullGroup = await GroupModel.fetchGroup(this.group);
      if (fullGroup) fullGroup.removeInvite(this);
    }

    if (group) {
      const fullGroup = await GroupModel.fetchGroup(group);
      if (!fullGroup) return false;

      fullGroup.addInvite(this);
    }

    this.group = group;
    return true;
  }

  public async revoke(
    this: DocumentType<Invite>,
    options: RevokeInviteOptions = { revokeFromUser: false, returnUser: false }
  ) {
    const { revokeFromUser = false, returnUser = false } = options;

    if (!this.user) return null;

    let user;
    if (returnUser || revokeFromUser) {
      user = await UserModel.fetchUser(this.user);
    }

    this.user = undefined;

    if (!user) return null;

    if (revokeFromUser) {
      const event = await EventModel.fetchEvent(this.event);
      if (!event) throw new Error("Couldn't find an Event for this invite.");

      const revoked = await user.revokeInvite(event);

      if (InviteModel.getId(this) !== InviteModel.getId(revoked)) {
        console.error(`Probably revoked an erroneous invite
          - The user was: ${user.toString()}
          - The invite that got revoked was: ${revoked?.toString()}
          - The invite that had to be revoked was: ${this.toString()}}
        `);
      }
    }

    return returnUser ? user : null;
  }

  public async resolve(
    this: DocumentType<Invite>,
    user: DocumentType<User>,
    forceRevoke = false
  ) {
    if (this.user && forceRevoke) {
      this.revoke({ revokeFromUser: true });
    }
    this.user = user;
  }

  public async getAllRoles(this: DocumentType<Invite>) {
    const event = await EventModel.fetchEvent(this.event);
    if (!event)
      throw new Error("The Event this Invite belongs to couldn't be found.");

    const roles = this.roles
      .map((role) => {
        return event.roles.get(role);
      })
      .filter((role) => role !== undefined && role !== "") as string[];

    if (this.group) {
      const group = await GroupModel.fetchGroup(this.group);
      if (!group)
        throw new Error("The Group this Invite belongs to couldn't be found.");

      roles.push(group.role);
    }

    return roles;
  }

  public async setRole(
    this: DocumentType<Invite>,
    role: string,
    add: boolean = false
  ) {
    const event = await EventModel.fetchEvent(this.event);
    if (!event)
      throw new Error("The Event this Invite belongs to couldn't be found.");

    if (!event.roles.has(role))
      throw new Error(
        "The role you are trying to give is not defined for this Event"
      );

    if (add) {
      if (!this.roles.includes(role)) this.roles.push(role);
    } else {
      this.roles.splice(0, this.roles.length);
      this.roles.push("role");
    }
  }

  public static findExact(
    this: ReturnModelType<typeof Invite>,
    event: Ref<Event> | string,
    email: string
  ) {
    if (!event) return null;
    return this.findOne({ event, email });
  }

  public static async fetchAllInvites(
    this: ReturnModelType<typeof Invite>,
    invites: (Ref<Invite, Types.ObjectId> | string)[]
  ) {
    return getFulfilledResults(
      await Promise.allSettled(invites.map((invite) => this.fetchInvite(invite)))
    );
  }

  public static async fetchInvite(
    this: ReturnModelType<typeof Invite>,
    invite: Ref<Invite> | string | null
  ): Promise<DocumentType<Invite> | null> {
    if (!invite) return null;

    if (
      typeof invite !== "string" &&
      isDocument<Invite, Types.ObjectId | undefined>(invite)
    )
      return invite;

    if (invite instanceof Invite) {
      const id = (invite as any)._id;
      return id ? await this.findById(id) : null;
    }

    return await this.findById(invite);
  }

  public static getId(
    this: ReturnModelType<typeof Invite>,
    invite: Ref<Invite> | string | null
  ): string | undefined {
    if (!invite) return undefined;

    if (
      typeof invite !== "string" &&
      isDocument<Invite, Types.ObjectId | undefined>(invite)
    )
      return invite._id.toString();

    if (invite instanceof Invite) {
      const id = (invite as any)._id;
      return id ? id.toString() : undefined;
    }

    return invite.toString();
  }
}

export type InviteDocument = DocumentType<Invite>;

export const InviteModel = getModelForClass(Invite);
