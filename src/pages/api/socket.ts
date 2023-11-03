import { NextApiRequest } from "next";
import { NextApiResponseServerIO } from "@/types/types";
import { startSocketServer } from "@/socket/startSocketServer";

export default function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIO
) {
  startSocketServer(req, res);

  res.send("sockettttt");
}
