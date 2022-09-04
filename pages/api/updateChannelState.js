import { hop } from "../../utils/hop";

export default async function handler(req, res) {
  await hop.channels.setState(req.query.channel, (s) => req.body);
  res.status(200).json({ message: "updated successfully" });
}
