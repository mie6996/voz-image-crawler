import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET(request: Request, context: any) {
  const { params } = context;
  const id = Number(params.id);

  const result = await prisma.image.findFirst({
    where: {
      id,
    },
  });

  return NextResponse.json(result);
}
