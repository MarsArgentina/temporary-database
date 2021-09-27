import * as xlsx from "xlsx";
import { guaranteeBuffer } from "../helpers/guaranteeBuffer";
import { getFulfilledResults } from "../helpers/getResults";
import { InviteItem } from "../models/invite";
import { UserDocument, UserItem, UserModel } from "../models/user";
import { EventDocument } from "../models/event";

type ExcelData = {
  name: string;
  mail: string;
  role: string;
  location: string;
  memberid?: string;
  birthday?: Date;
};

export const parseOldData = async (
  file: Buffer | ArrayBuffer | string
): Promise<[UserItem[], InviteItem[]]> => {
  const buffer = guaranteeBuffer(file);
  if (!buffer) {
    throw new Error("File couldn't be converted to a proper buffer");
  }

  const workbook = xlsx.read(buffer, { type: "buffer", cellDates: true });

  const data: ExcelData[] = xlsx.utils.sheet_to_json(
    workbook.Sheets[workbook.SheetNames[0]]
  );

  const invites: InviteItem[] = data.map((item) => ({
    email: item.mail,
    role: item.role,
    meta: JSON.stringify({
      location: item.location,
      name: item.name,
    }),
  }));

  const users: UserItem[] = data
    .filter((item) => Boolean(item.memberid))
    .map((item) => ({
      id: item.memberid as string,
      displayName: item.name,
      invite: item.mail,
      meta: item.birthday
        ? { possibleBirthday: item.birthday?.toISOString() }
        : undefined,
    } as UserItem));

  return [users, invites];
};

export type Overwrites = {
  role: boolean;
  inviteMeta: boolean;
  userMeta: boolean;
  name: boolean;
};

export const importFromParsedOldData = async (
  event: EventDocument,
  users: UserItem[],
  invites: InviteItem[],
  overwrites: Partial<Overwrites> = {}
) => {
  overwrites = {
    role: true,
    inviteMeta: true,
    userMeta: true,
    name: true,
    ...overwrites,
  };

  const invitesResult = await event.addInviteList(
    invites,
    {
      overwriteRole: overwrites.role,
      overwriteMeta: overwrites.inviteMeta,
      deactivateMissing: false,
    }
  );

  const usersResult = await UserModel.addUsersFromPastEvent(event, users, {
    overwriteMeta: overwrites.userMeta,
    overwriteName: overwrites.name
  })

  return {
    users: getFulfilledResults(usersResult) as UserDocument[],
    invites: invitesResult,
  };
};

export const importFromOldData = async (
  event: EventDocument,
  file: Buffer | ArrayBuffer | string,
  overwrites: Partial<Overwrites> = {}
) => {
  const [users, invites] = await parseOldData(file);

  return await importFromParsedOldData(event, users, invites, overwrites);
};
