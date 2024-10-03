import { prisma } from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const data = await prisma.image.findFirst({
    where: {
      id,
    },
  });

  return NextResponse.json(data);
}
