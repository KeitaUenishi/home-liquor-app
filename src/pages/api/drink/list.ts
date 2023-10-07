// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import prisma from "@/lib/prisma";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const data = await prisma.drink.findMany({
      take: 50,
      orderBy: {
        drank_at: "desc",
      },
    });

    res.status(200).json({
      data: data.map((d) => ({
        ...d,
        drank_at: d.drank_at.toISOString().split("T")[0].replaceAll("-", "/"),
      })),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error });
  }
}
