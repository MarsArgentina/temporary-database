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

export class Group {
  @prop({ required: true })
  event!: string;

  @prop({ ref: () => "Invite", required: true, default: () => [] })
  members!: Ref<Invite, Types.ObjectId>[];

  @prop({ type: String, required: true, default: () => [] })
  channels!: string[];

  @prop()
  meta?: string;

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

  public addInvite(
    this: DocumentType<Group>,
    invite: Ref<Invite, Types.ObjectId>
  ) {
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
    group: Ref<Group, Types.ObjectId>
  ) {
    if (!group) return null;

    if (isDocument(group)) return group;

    return await this.findOne({ _id: group });
  }
}

export const GroupModel = getModelForClass(Group);
