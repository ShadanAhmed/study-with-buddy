// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { hop } from "../../utils/hop";

// Import the ChannelType enum from Hop sdk
import { ChannelType } from "@onehop/js";

export default async function handler(req, res) {
  const channel = await hop.channels.create(
    // Channel Type; either: "unprotected", "public", or "private"
    ChannelType.UNPROTECTED,
    // Channel ID; leave this field as null if you want an auto-generated ID
    req.query.meetingCode,
    {
      state: {
        phase: 1,
        countdownString: "5:00",
      },
    }
  );
  res.status(200).json({ channel });
}
