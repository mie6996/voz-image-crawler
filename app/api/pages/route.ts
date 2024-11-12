import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";

export async function GET(request: NextRequest) {
  const pages = await prisma.parentPage.findMany({
    select: {
      id: true,
      url: true,
      title: true,
      maxPage: true,
    },
  });

  const data = {
    message: pages.length > 0 ? "Success" : "No pages found",
    pages,
  };

  return NextResponse.json(data);
}
