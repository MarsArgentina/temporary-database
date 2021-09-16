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
import { guaranteeError } from "../helpers/guaranteeError";
import { getFulfilledResults } from "../helpers/getFulfilledResults";

export type RevokeInviteOptions = {
  revokeFromUser?: boolean;
  returnUser?: boolean;
};

export type AddInvitesOptions = {
  addRole: boolean;
  deactivateMissing: boolean;
  overwriteMeta: boolean;
};

export type InviteItem = { email: string; meta?: string; role?: string };

@index({ event: 1, email: 1 }, { unique: true })
export class Invite {
  @prop({ required: true, default: true })
  public active!: boolean;

  @prop({ required: true })
  public event!: string;

  @prop({ required: true })
  public email!: string;

  @prop({
    type: String,
    required: true,
    default: () => ["participant"],
    minlength: 1,
  })
  public role!: string[];

  @prop()
  public meta?: string;

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
      const revoked = await user.revokeInvite(this.event);

      if (this._id !== revoked?._id) {
        console.error(`Probably revoked an erroneous invite
          - The user was: ${user.toString()}
          - The revoked that got revoked was: ${revoked?.toString()}
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

  public isEqual(
    this: DocumentType<Invite>,
    invite: Ref<Invite, Types.ObjectId>
  ): boolean {
    if (isDocument(invite)) return invite === this || invite._id === this._id;

    return invite && this._id === invite;
  }

  public async setRole(
    this: DocumentType<Invite>,
    role: string,
    add: boolean = false
  ) {
    if (add) {
      if (!this.role.includes(role)) this.role.push(role);
    } else {
      this.role.splice(0, this.role.length);
      this.role.push("role");
    }
  }

  public static getId(
    this: ReturnModelType<typeof Invite>,
    invite: Ref<Invite>
  ) {
    if (!invite) return undefined;

    if (isDocument(invite)) return invite._id as Types.ObjectId;

    if (invite instanceof Invite)
      return (invite as any)._id as Types.ObjectId | undefined;

    return invite;
  }

  public static findExact(
    this: ReturnModelType<typeof Invite>,
    event: string,
    email: string
  ) {
    return this.findOne({ event, email });
  }

  public static async addInvite(
    this: ReturnModelType<typeof Invite>,
    event: string,
    email: string
  ): Promise<[DocumentType<Invite>, boolean]> {
    const found = await this.findExact(event, email);

    if (found) return [found, true];

    const created = await this.create({ event, email });

    const user = await UserModel.findByUnresolvedInvite(event, email);
    if (user) {
      user.forcedResolveInvite(created);
      await user.save();
    }

    return [created, false];
  }

  public static async addInviteList(
    this: ReturnModelType<typeof Invite>,
    event: string,
    invites: InviteItem[],
    role: string,
    options: Partial<AddInvitesOptions> = {}
  ) {
    const opts: AddInvitesOptions = {
      addRole: false,
      deactivateMissing: false,
      overwriteMeta: true,
      ...options,
    };

    const result = {
      found: [] as DocumentType<Invite>[],
      created: [] as DocumentType<Invite>[],
      error: [] as { email: string; error: Error }[],
      deactivated: 0,
    };

    if (opts.deactivateMissing) {
      const updated = await this.updateMany(
        { role, active: true },
        { active: false }
      );
      result.deactivated = updated.nModified;
    }

    await Promise.allSettled(
      invites.map(async ({ email, ...item }) => {
        try {
          const [invite, found] = await this.addInvite(event, email);

          if (found) {
            result.found.push(invite);
          } else {
            result.created.push(invite);
          }

          invite.active = true;
          invite.meta = opts.overwriteMeta
            ? item.meta
            : invite.meta ?? item.meta;
          invite.setRole(item.role ?? role, opts.addRole);

          await invite.save();
        } catch (error) {
          result.error.push({ email, error: guaranteeError(error) });
        }

        return true;
      })
    );

    if (opts.deactivateMissing) {
      result.deactivated -= result.found.length;
    }

    return result;
  }

  public static async fetchInvite(
    this: ReturnModelType<typeof Invite>,
    invite: Ref<Invite, Types.ObjectId>
  ) {
    if (!invite) return undefined;

    if (isDocument(invite)) return invite;

    return (await this.findOne({ _id: invite })) ?? undefined;
  }

  public static async fetchAllInvites(
    this: ReturnModelType<typeof Invite>,
    invites: Ref<Invite, Types.ObjectId>[]
  ) {
    return getFulfilledResults(
      await Promise.allSettled(invites.map(this.fetchInvite))
    );
  }
}

export const InviteModel = getModelForClass(Invite);
