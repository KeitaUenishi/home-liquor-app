// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import prisma from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { name } = req.body;
  try {
    await prisma.liquor_list.create({
      data: {
        name: name,
      },
    });

    res.status(200).end();
  } catch (error) {
    res.status(500).json({ error: error });
  }
}
