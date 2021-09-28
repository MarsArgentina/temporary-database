import * as xlsx from "xlsx";
import { InviteModel, EventDocument } from "..";
import { guaranteeBuffer } from "../helpers";

export type GroupInfo = {
  name: string;
  channels: string[];
  role: string;
  invites: { email: string }[];
  meta?: {};
};

type ExcelData = {
  Event: string;
  ["Registration Date"]: string;
  Name: string;
  Email: string;
  Location: string;
  ["RSVP Status"]: string;
  Group: string;
  ["Event Location"]: string;
};

export const parseOldGroups = (
  file: Buffer | ArrayBuffer | string
): GroupInfo[] => {
  const buffer = guaranteeBuffer(file);
  if (!buffer) {
    throw new Error("File couldn't be converted to a proper buffer");
  }

  const workbook = xlsx.read(buffer, { type: "buffer", cellDates: true });

  const data: ExcelData[] = xlsx.utils.sheet_to_json(
    workbook.Sheets[workbook.SheetNames[0]]
  );

  const groups = new Map<string, GroupInfo>();

  data.forEach((item) => {
    const name = (item.Group ?? "").trim()

    if (!name) return;

    const group: GroupInfo = groups.get(name.toLowerCase()) ?? {
      name,
      role: "",
      invites: [],
      channels: [],
      meta: {
        location: item["Event Location"]
      }
    };

    group.invites.push({ email: item.Email });

    groups.set(name.toLowerCase(), group);
  });

  return Array.from(groups.values());
};

export const importGroupInfo = async (
  event: EventDocument,
  info: GroupInfo[]
) => {
  const result = await Promise.all(
    info.map(async ({ name, channels, role, invites, meta }) => {
      const group = await event.addGroup(name, role, channels);

      const results = await Promise.all(
        invites.map(async ({ email }) => {
          try {
            const invite = await InviteModel.findOne({ email, event });

            if (invite) {
              group.addInvite(invite);
              return true;
            }

            return false;
          } catch (e) {
            console.error(e);
            return false;
          }
        })
      );

      group.meta = JSON.stringify({
        ...JSON.parse(group.meta ?? "{}"),
        ...meta,
      });

      try {
        await group.save();

        return {
          invites: results.length,
          success: results.filter((value) => value).length,
        };
      } catch (e) {
        console.error(e);
        return {
          invites: results.length,
          success: 0,
        };
      }
    })
  );

  const final = result.reduce((prev, next) => {
    return {
      invites: prev.invites + next.invites,
      success: prev.success + next.success,
    };
  });

  console.log(`Invites added: ${final.success}/${final.invites}`);
};

export const importOldGroups = async (
  event: EventDocument,
  file: Buffer | ArrayBuffer | string
) => {
  const info = parseOldGroups(file);

  return importGroupInfo(event, info);
};
