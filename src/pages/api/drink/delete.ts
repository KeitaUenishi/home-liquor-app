// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import prisma from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.body;
  try {
    await prisma.drink.delete({
      where: {
        id: id,
      },
    });

    res.status(200).end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
}
