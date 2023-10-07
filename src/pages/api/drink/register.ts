// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import prisma from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { liquor_id, user_id } = req.body;
  try {
    await prisma.drink.create({
      data: {
        liquor_list: {
          connect: { id: liquor_id },
        },
        user: {
          connect: { id: user_id },
        },
      },
    });

    res.status(200).end();
  } catch (error) {
    res.status(500).json({ error: error });
  }
}
