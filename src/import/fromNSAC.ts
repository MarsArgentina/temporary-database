import * as xlsx from "xlsx";
import { guaranteeBuffer } from "../helpers/guaranteeBuffer";
import { AddInvitesOptions, InviteItem, InviteModel } from "../models/invite";

type ExcelData = {
  Event: string;
  Name: string;
  Email: string;
  Location: string;
  ["Registration Date"]: string;
  ["RSVP Status"]: string;
};

export const parseNSAC = async (
  file: Buffer | ArrayBuffer | string
): Promise<InviteItem[]> => {
  const buffer = guaranteeBuffer(file);
  if (!buffer) {
    throw new Error("File couldn't be converted to a proper buffer");
  }

  const workbook = xlsx.read(buffer, { type: "buffer" });

  const data: ExcelData[] = xlsx.utils.sheet_to_json(
    workbook.Sheets[workbook.SheetNames[0]]
  );

  return data.map((item) => ({
    email: item.Email,
    meta: JSON.stringify({
      location: item.Location,
      name: item.Name,
      registrationDate: item["Registration Date"],
    }),
  }));
};

export const importFromNSAC = async (
  file: Buffer | ArrayBuffer | string,
  event: string,
  role: string,
  options: Partial<AddInvitesOptions>
) => {
  const invites = await parseNSAC(file);

  return await InviteModel.addInviteList(event, invites, role, options);
};
