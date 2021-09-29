import {
  getModelForClass,
  prop,
  Ref,
  isDocument,
  DocumentType,
  ReturnModelType,
} from "@typegoose/typegoose";
import { Types } from "mongoose";
import { Invite, InviteModel } from "./invite";
import { Event, EventModel } from "./event";
import { generate as passwordGenerator } from "generate-password";

export class Group {
  @prop({ required: true })
  name!: string;

  @prop({required: true, default: "", index: true})
  mainChannel!: string;

  @prop({ ref: () => "Event", required: true })
  event!: Ref<Event, Types.ObjectId>;

  @prop({ ref: () => "Invite", required: true, default: () => [] })
  members!: Ref<Invite, Types.ObjectId>[];

  @prop({ type: String, required: true, default: () => [] })
  channels!: string[];

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
  accessCode!: string;

  @prop({ required: true })
  role!: string;

  @prop({ required: true, default: false })
  isOpen!: boolean;

  @prop({ default: "{}" })
  meta!: string;

  public getInviteIndex(
    this: DocumentType<Group>,
    invite: Ref<Invite, Types.ObjectId>
  ) {
    if (!invite) return -1;
    if (this.members.length === 0) return -1;

    const id = InviteModel.getId(invite);
    if (!id) return -1;

    return this.members.findIndex((found) => {
      return InviteModel.getId(found) === id;
    });
  }

  public hasInvite(
    this: DocumentType<Group>,
    invite: Ref<Invite, Types.ObjectId>
  ) {
    return this.getInviteIndex(invite) !== -1;
  }

  public addInvite(this: DocumentType<Group>, invite: DocumentType<Invite>) {
    if (EventModel.getId(invite.event) !== EventModel.getId(this.event))
      throw new Error(
        "Tried to add an Invite that belongs to a different Event than this Group."
      );

    if (this.hasInvite(invite)) return;
    this.members.push(invite);
  }

  public removeInvite(
    this: DocumentType<Group>,
    invite: Ref<Invite, Types.ObjectId>
  ) {
    const index = this.getInviteIndex(invite);

    if (index === -1) return false;

    this.members.splice(index, 1);
    return true;
  }

  public static async fetchGroup(
    this: ReturnModelType<typeof Group>,
    group: Ref<Group> | string | null
  ): Promise<DocumentType<Group> | null> {
    if (!group) return null;

    if (
      typeof group !== "string" &&
      isDocument<Group, Types.ObjectId | undefined>(group)
    )
      return group;

    if (group instanceof Group) {
      const id = (group as any)._id;
      return id ? await this.findById(id) : null;
    }

    return await this.findById(group);
  }

  public static getId(
    this: ReturnModelType<typeof Group>,
    group: Ref<Group> | string | null
  ): string | undefined {
    if (!group) return undefined;

    if (
      typeof group !== "string" &&
      isDocument<Group, Types.ObjectId | undefined>(group)
    )
      return group._id.toString();

    if (group instanceof Group) {
      const id = (group as any)._id;
      return id ? id.toString() : undefined;
    }

    return group.toString();
  }
}

export type GroupDocument = DocumentType<Group>;

export const GroupModel = getModelForClass(Group);
