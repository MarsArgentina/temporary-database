import {
  getModelForClass,
  prop,
  Ref,
  isDocument,
  DocumentType,
  ReturnModelType,
} from "@typegoose/typegoose";
import { Types } from "mongoose";
import { UserModel } from "./user";
import { guaranteeError } from "../helpers";
import { Group, GroupModel } from "./group";
import {
  AddInvitesOptions,
  AddInvitesResult,
  Invite,
  InviteItem,
  InviteModel,
} from "./invite";

export class Event {
  @prop({ required: true, unique: true })
  name!: string;

  @prop({ required: true, index: true, default: "" })
  category!: string;

  @prop({ ref: () => "Invite", required: true, default: () => [] })
  invites!: Ref<Invite, Types.ObjectId>[];

  @prop({ ref: () => "Group", required: true, default: () => [] })
  groups!: Ref<Group, Types.ObjectId>[];

  @prop({ required: true, default: false })
  isHidden!: boolean;

  @prop({ required: true, default: 0 })
  maxGroupSize!: number;

  @prop({
    type: String,
    required: true,
    default: () => new Map<string, string>(),
  })
  public roles!: Map<string, string>;

  @prop({ default: "{}" })
  meta!: string;

  public async addGroup(
    this: DocumentType<Event>,
    name: string,
    role: string,
    mainChannel?: string,
    channels: string[] = []
  ) {
    const group = await GroupModel.create({
      event: this,
      name,
      role,
      mainChannel,
      channels,
    });

    group.save();

    this.groups.push(group);

    return group;
  }

  public getInviteIndex(
    this: DocumentType<Event>,
    invite: Ref<Invite, Types.ObjectId>
  ) {
    if (!invite) return -1;
    if (this.invites.length === 0) return -1;

    const id = InviteModel.getId(invite);
    if (!id) return -1;

    return this.invites.findIndex((found) => {
      return InviteModel.getId(found) === id;
    });
  }

  public hasInvite(
    this: DocumentType<Event>,
    invite: Ref<Invite, Types.ObjectId>
  ) {
    return this.getInviteIndex(invite) !== -1;
  }

  public async addInvite(
    this: DocumentType<Event>,
    email: string
  ): Promise<[DocumentType<Invite>, boolean]> {
    const found = await InviteModel.findExact(this, email);

    if (found) return [found, true];

    const created = await InviteModel.create({ event: this, email });

    const user = await UserModel.findByUnresolvedInvite(this, email);
    if (user) {
      user.forcedResolveInvite(this, created);
      await user.save();
    }

    return [created, false];
  }

  public async addInviteList(
    this: DocumentType<Event>,
    invites: InviteItem[],
    options: Partial<AddInvitesOptions> = {}
  ) {
    const role =
      options.role ?? (this.roles.keys().next().value as string | undefined);

    if (!role || !this.roles.has(role))
      throw new Error(
        `The role required for these invites doesn't exist in this Event. Event: "${this.name}", Role: "${role}"`
      );

    const opts: AddInvitesOptions = {
      role: "",
      deactivateMissing: false,
      overwriteRole: true,
      overwriteMeta: true,
      ...options,
    };

    const result: AddInvitesResult = {
      found: [],
      created: [],
      error: [],
      deactivated: 0,
    };

    if (opts.deactivateMissing) {
      const updated = await InviteModel.updateMany(
        { role, active: true },
        { active: false }
      );
      result.deactivated = updated.nModified;
    }

    await Promise.allSettled(
      invites.map(async ({ email, ...item }) => {
        try {
          const [invite, found] = await this.addInvite(email);

          if (found) {
            result.found.push(invite);
          } else {
            result.created.push(invite);
          }

          const oldMeta = JSON.parse(invite.meta);
          invite.meta = JSON.stringify(
            opts.overwriteMeta
              ? { ...oldMeta, ...item.meta }
              : { ...item.meta, ...oldMeta }
          );

          invite.active = true;
          invite.setRole(item.role ?? role, opts.overwriteRole);

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

  public static async fetchEvent(
    this: ReturnModelType<typeof Event>,
    event: Ref<Event> | string | null
  ): Promise<DocumentType<Event> | null> {
    if (!event) return null;

    if (
      typeof event !== "string" &&
      isDocument<Event, Types.ObjectId | undefined>(event)
    )
      return event;

    if (event instanceof Event) {
      const id = (event as any)._id;
      return id ? await this.findById(id) : null;
    }

    return await this.findById(event).exec();
  }

  public static getId(
    this: ReturnModelType<typeof Event>,
    event: Ref<Event> | string | null
  ): string | undefined {
    if (!event) return undefined;

    if (
      typeof event !== "string" &&
      isDocument<Event, Types.ObjectId | undefined>(event)
    )
      return event._id.toString();

    if (event instanceof Event) {
      const id = (event as any)._id;
      return id ? id.toString() : undefined;
    }

    return event.toString();
  }
}

export type EventDocument = DocumentType<Event>;

export const EventModel = getModelForClass(Event);
