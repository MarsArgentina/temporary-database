import { UserModel } from "..";
import { EventDocument } from "../models/event";

export type GroupInfo = {
  name: string;
  channels: string[];
  role: string;
  invites: string[];
  meta?: {};
};

export const importOldGroups = async (
  event: EventDocument,
  info: GroupInfo[]
) => {
  const result = await Promise.all(
    info.map(async ({ name, channels, role, invites, meta }) => {
      const group = await event.addGroup(name, role, channels);

      const results = await Promise.all(
        invites.map(async (discord) => {
          try {
            const user = await UserModel.findFromDiscord(discord);
            const invite = await user?.getInvite(event, false);

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

      group.meta = JSON.stringify({ ...JSON.parse(group.meta), ...meta });

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
