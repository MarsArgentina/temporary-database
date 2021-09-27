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
import { Invite, InviteDocument, InviteModel } from "./invite";
import { Event, EventModel } from "./event";

export type AddUsersOptions = {
  overwriteName: boolean;
  overwriteMeta: boolean;
};

export type UserItem = {
  id: string;
  displayName: string;
  invite: string;
  meta?: {};
};

@pre<User>("remove", function () {
  Promise.allSettled(
    Array.from(this.resolvedInvites.values()).map(async (id) => {
      const invite = await InviteModel.fetchInvite(id);
      if (!invite) return;
      await invite.revoke();
      await invite.save();
    })
  );
})
export class User {
  @prop({ required: true, unique: true })
  public discordId!: string;

  @prop({ required: true })
  public name!: string;

  @prop()
  public displayName?: string;

  @prop({ required: true, default: false })
  public inDiscord!: boolean;

  @prop({ default: false })
  public isUpdating?: boolean;

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

  @prop({ default: "{}" })
  public meta!: string;

  @prop({
    type: String,
    required: true,
    default: () => new Map<string, string>(),
  })
  public resolvedInvites!: Map<string, string>;

  public async isValidated(this: DocumentType<User>) {
    return this.ageRange && this.ageRange !== AgeRange.unspecified;
  }

  public async getAllRoles(this: DocumentType<User>) {
    const invites = await InviteModel.fetchAllInvites(
      Array.from(this.resolvedInvites.values())
    );

    const inviteRoles = await Promise.all(
      invites.map(async (invite) => {
        if (!invite) return [];

        return await invite.getAllRoles().catch((e) => {
          return [] as string[]
        });
      })
    );

    return [...this.roles, ...inviteRoles.flat(1)];
  }

  public async revokeInvite(
    this: DocumentType<User>,
    event: Ref<Event> | string
  ) {
    const eventId = EventModel.getId(event);
    if (!eventId)
      throw new Error(
        `Tried to revoke an invite of an unknown event: ${event?.toString()}`
      );

    const invite = this.resolvedInvites.get(eventId);
    const resolved = invite ? await InviteModel.fetchInvite(invite) : null;

    if (resolved) {
      const revoked = await resolved.revoke({ returnUser: true });

      if (revoked?._id.toString() !== this._id.toString()) {
        console.error(`Probably revoked an erroneous invite
          - The invite was: ${resolved.toString()}
          - The user that got revoked was: ${revoked?.toString()}
          - The user that had to be revoked was: ${this.toString()}}
        `);
      }

      this.resolvedInvites.delete(eventId);

      return resolved;
    } else {
      this.unresolvedInvites.delete(eventId);
      return null;
    }
  }

  public async forcedResolveInvite(
    this: DocumentType<User>,
    event: Ref<Event> | string,
    invite: Ref<Invite> | string
  ) {
    const eventId = EventModel.getId(event);
    const inviteId = InviteModel.getId(invite);

    if (!eventId)
      throw new Error(
        `Tried to resolve an invite but couldn't find the id of Event: ${event?.toString()}`
      );
    if (!inviteId)
      throw new Error(
        `Tried to resolve an invite but couldn't find the id of Invite: ${invite?.toString()}`
      );

    this.unresolvedInvites.delete(eventId);
    this.resolvedInvites.set(eventId, inviteId);
  }

  public async resolveInvite(
    this: DocumentType<User>,
    event: Ref<Event> | string,
    forceRevoke = false
  ) {
    const eventId = EventModel.getId(event);
    if (!eventId) return null;

    const email = this.unresolvedInvites.get(eventId);
    if (!email) return null;

    const invite = await InviteModel.findExact(event, email);
    if (!invite) return null;

    const resolved = invite.resolve(this, forceRevoke);
    if (!resolved) return null;

    this.forcedResolveInvite(event, invite);
    await invite.save();

    return invite;
  }

  public async setInvite(
    this: DocumentType<User>,
    event: Ref<Event> | string,
    email?: string
  ) {
    const eventId = EventModel.getId(event);
    if (!eventId)
      throw new Error(
        `Couldn't set an invite for unknown Event: ${event?.toString()}`
      );

    const revoked = await this.revokeInvite(event);

    if (email && email !== "") {
      this.unresolvedInvites.set(eventId, email);

      const resolved = await this.resolveInvite(event);

      return [revoked, resolved] as const;
    }
  }

  public async getInvite(
    this: DocumentType<User>,
    event: string | Ref<Event>,
    unresolved?: boolean
  ): Promise<null | InviteDocument | string>;
  public async getInvite(
    this: DocumentType<User>,
    event: string | Ref<Event>,
    unresolved?: false
  ): Promise<null | InviteDocument>;
  public async getInvite(
    this: DocumentType<User>,
    event: string | Ref<Event>,
    unresolved: true
  ): Promise<null | string>;
  public async getInvite(
    this: DocumentType<User>,
    event: string | Ref<Event>,
    unresolved = false
  ): Promise<null | InviteDocument | string> {
    const eventId = EventModel.getId(event);
    if (!eventId) return null;

    if (unresolved) {
      return this.unresolvedInvites.get(eventId) ?? null;
    } else {
      const invite = this.resolvedInvites.get(eventId);
      if (!invite) return null;

      return (await InviteModel.fetchInvite(invite)) ?? null;
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

  static startUpdate(this: ReturnModelType<typeof User>) {
    return this.updateMany({}, { isUpdating: true }, { multi: true }).exec();
  }

  static finishUpdate(this: ReturnModelType<typeof User>) {
    return this.updateMany(
      { isUpdating: true },
      { inDiscord: false },
      { multi: true }
    ).exec();
  }

  static findFromDiscord(
    this: ReturnModelType<typeof User>,
    discordId: string
  ) {
    return this.findOne({ discordId });
  }

  static async addFromDiscord(
    this: ReturnModelType<typeof User>,
    user: { id: string; displayName: string }
  ) {
    const found = await this.findFromDiscord(user.id);

    return [found ?? (await this.createFromDiscord(user)), !!found] as const;
  }

  static async addUsersFromPastEvent(
    event: Ref<Event> | string,
    users: UserItem[],
    options: Partial<AddUsersOptions> = {}
  ) {
    const eventId = EventModel.getId(event);
    if (!eventId)
      throw new Error(
        `Couldn't add users from unknown Event: ${event?.toString()}`
      );

    const opts = {
      overwriteName: true,
      overwriteMeta: true,
      ...options,
    };

    return await Promise.allSettled(
      users.map(async (info) => {
        const [user] = await UserModel.addFromDiscord(info);

        user.name = opts.overwriteName ? info.displayName : user.name;

        const oldMeta = JSON.parse(user.meta);
        user.meta = JSON.stringify(
          opts.overwriteMeta
            ? { ...oldMeta, ...info.meta }
            : { ...info.meta, ...oldMeta }
        );

        await user.setInvite(event, info.invite);
        return await user.save();
      })
    );
  }

  public static findByUnresolvedInvite(
    this: ReturnModelType<typeof User>,
    event: Ref<Event> | string,
    email: string
  ) {
    return this.findOne({
      [`unresolvedInvites.${EventModel.getId(event)}`]: email,
    }).exec();
  }

  public static async fetchUser(
    this: ReturnModelType<typeof User>,
    user: Ref<User> | string | null
  ): Promise<DocumentType<User> | null> {
    if (!user) return null;

    if (
      typeof user !== "string" &&
      isDocument<User, Types.ObjectId | undefined>(user)
    )
      return user;

    if (user instanceof User) {
      const id = (user as any)._id;
      return id ? await this.findById(id) : null;
    }

    return await this.findById(user);
  }

  public static getId(
    this: ReturnModelType<typeof User>,
    user: Ref<User> | string | null
  ): string | undefined {
    if (!user) return undefined;

    if (
      typeof user !== "string" &&
      isDocument<User, Types.ObjectId | undefined>(user)
    )
      return user._id.toString();

    if (user instanceof User) {
      const id = (user as any)._id;
      return id ? id.toString() : undefined;
    }

    return user.toString();
  }
}

export type UserDocument = DocumentType<User>;

export const UserModel = getModelForClass(User);
