import { NextApiRequest } from "next";

export const getStaticFilePath = (req: NextApiRequest, fileName: string) => {
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
  return `${protocol}://${req.headers.host}/images/${fileName}`;
};
