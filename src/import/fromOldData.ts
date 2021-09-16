import * as xlsx from "xlsx";
import { guaranteeBuffer } from "../helpers/guaranteeBuffer";
import { getFulfilledResults } from "../helpers/getFulfilledResults";
import { InviteItem, InviteModel } from "../models/invite";
import { UserItem, UserModel } from "../models/user";

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
        ? JSON.stringify({ possibleBirthday: item.birthday?.toISOString() })
        : undefined,
    }));

  return [users, invites];
};

type Overwrites = {
  role: boolean;
  inviteMeta: boolean;
  userMeta: boolean;
  name: boolean;
};

export const importFromParsedOldData = async (
  users: UserItem[],
  invites: InviteItem[],
  event = "nsac2020",
  overwrites: Partial<Overwrites> = {}
) => {
  overwrites = {
    role: true,
    inviteMeta: true,
    userMeta: true,
    name: true,
    ...overwrites,
  };

  const invitesResult = await InviteModel.addInviteList(
    event,
    invites,
    "participant",
    {
      addRole: !overwrites.role,
      overwriteMeta: !overwrites.inviteMeta,
      deactivateMissing: false,
    }
  );

  const usersResult = await UserModel.addUserList(event, users, {
    overwriteMeta: overwrites.userMeta,
    overwriteName: overwrites.name
  })

  return {
    users: getFulfilledResults(usersResult),
    invites: invitesResult,
  };
};

export const importFromOldData = async (
  file: Buffer | ArrayBuffer | string,
  event = "nsac2020",
  overwrites: Partial<Overwrites> = {}
) => {
  const [users, invites] = await parseOldData(file);

  return await importFromParsedOldData(users, invites, event, overwrites);
};
