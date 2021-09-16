import {
  getModelForClass,
  prop,
  pre,
  Ref,
  isDocument,
  DocumentType,
  ReturnModelType,
} from "@typegoose/typegoose";
import { Types } from "mongoose";
import { AgeRange } from "../types/agerange";
import { Invite, InviteModel } from "./invite";

export type AddUsersOptions = {
  overwriteName: boolean;
  overwriteMeta: boolean;
};

export type UserItem = {
  id: string;
  displayName: string;
  invite: string;
  meta?: string;
};

@pre<User>("remove", function () {
  Promise.allSettled(
    this.resolvedInvites.map(async (invite) => {
      (await InviteModel.fetchInvite(invite))?.revoke();
    })
  );
})
export class User {
  @prop({ required: true, unique: true })
  public discordId!: string;

  @prop({ required: true })
  public name!: string;

  @prop({ required: true, default: false })
  public inDiscord!: boolean;

  @prop({ enum: AgeRange, type: Number, default: AgeRange.unspecified })
  public ageRange?: AgeRange;

  @prop({ type: String, required: true, default: () => [] })
  public roles!: string[];

  @prop({
    type: String,
    required: true,
    default: () => new Map<string, string>(),
  })
  public unresolvedInvites!: Map<string, string>;

  @prop()
  public meta?: string;

  @prop({ ref: () => "Invite", required: true, default: () => [] })
  public resolvedInvites!: Ref<Invite, Types.ObjectId>[];

  public async isValidated(this: DocumentType<User>) {
    return this.ageRange && this.ageRange !== AgeRange.unspecified;
  }

  public async revokeInvite(this: DocumentType<User>, event: string) {
    const invites = await InviteModel.fetchAllInvites(this.resolvedInvites);
    const resolved = invites.find((invite) => invite.event === event);

    if (resolved) {
      const revoked = await resolved.revoke({ returnUser: true });

      if (revoked?._id !== this._id) {
        console.error(`Probably revoked an erroneous invite
- The invite was: ${resolved.toString()}
- The user that got revoked was: ${revoked?.toString()}
- The user that had to be revoked was: ${this.toString()}}
`);
      }

      this.resolvedInvites.splice(
        this.resolvedInvites.findIndex((invite) => resolved.isEqual(invite)),
        1
      );

      return resolved;
    } else {
      this.unresolvedInvites.delete(event);
      return null;
    }
  }

  public async forcedResolveInvite(
    this: DocumentType<User>,
    invite: DocumentType<Invite>
  ) {
    this.unresolvedInvites.delete(invite.event);
    this.resolvedInvites.push(invite);
  }

  public async resolveInvite(
    this: DocumentType<User>,
    event: string,
    forceRevoke = false
  ) {
    const email = this.unresolvedInvites.get(event);
    if (!email) return null;

    const invite = await InviteModel.findExact(event, email);
    if (!invite) return null;

    const resolved = invite.resolve(this, forceRevoke);
    if (!resolved) return null;

    this.forcedResolveInvite(invite);

    return invite;
  }

  public async setInvite(
    this: DocumentType<User>,
    event: string,
    email?: string
  ) {
    const revoked = await this.revokeInvite(event);

    if (email && email !== "") {
      this.unresolvedInvites.set(event, email);

      const resolved = await this.resolveInvite(event);

      return [revoked, resolved] as const;
    }
  }

  public async getInvite(
    this: DocumentType<User>,
    event: string,
    unresolved?: boolean
  ): Promise<null | Invite | string>;
  public async getInvite(
    this: DocumentType<User>,
    event: string,
    unresolved?: false
  ): Promise<null | Invite>;
  public async getInvite(
    this: DocumentType<User>,
    event: string,
    unresolved: true
  ): Promise<null | string>;
  public async getInvite(
    this: DocumentType<User>,
    event: string,
    unresolved = false
  ): Promise<null | Invite | string> {
    if (unresolved) {
      return this.unresolvedInvites.get(event) ?? null;
    } else {
      const found = (
        await InviteModel.fetchAllInvites(this.resolvedInvites)
      ).find((invite) => invite.event === event);

      return found ? found : null;
    }
  }

  public static createFromDiscord(
    this: ReturnModelType<typeof User>,
    user: { id: string; displayName: string }
  ) {
    return this.create({
      discordId: user.id,
      name: user.displayName,
      inDiscord: true,
    });
  }

  static findFromDiscord(
    this: ReturnModelType<typeof User>,
    user: { id: string; displayName: string }
  ) {
    return this.findOne({ discordId: user.id });
  }

  static async addFromDiscord(
    this: ReturnModelType<typeof User>,
    user: { id: string; displayName: string }
  ) {
    const found = await this.findFromDiscord(user);

    return [found ?? (await this.createFromDiscord(user)), !!found] as const;
  }

  static async addUserList(
    event: string,
    users: UserItem[],
    options: Partial<AddUsersOptions> = {}
  ) {
    const opts = {
      overwriteName: true,
      overwriteMeta: true,
      ...options,
    };

    return await Promise.allSettled(
      users.map(async (info) => {
        const [user] = await UserModel.addFromDiscord(info);

        user.name = opts.overwriteName ? info.displayName : user.name;
        user.meta = opts.overwriteMeta
          ? user.meta ?? info.meta
          : info.meta ?? user.meta;

        await user.setInvite(event, info.invite);
        return await user.save();
      })
    );
  }

  public static async fetchUser(
    this: ReturnModelType<typeof User>,
    user: Ref<User, Types.ObjectId>
  ): Promise<DocumentType<User> | null> {
    if (!user) return null;

    if (isDocument(user)) return user;

    return await this.findOne({ _id: user });
  }

  public static findByUnresolvedInvite(
    this: ReturnModelType<typeof User>,
    event: string,
    email: string
  ) {
    return this.findOne({
      [`unresolvedInvites.${event}`]: email,
    }).exec();
  }
}

export const UserModel = getModelForClass(User);
