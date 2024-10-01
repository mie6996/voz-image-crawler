import { prisma } from "@/app/lib/prisma";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = searchParams.get("page") || "1";

  const pageData = await prisma.page.findFirst({
    where: {
      pageNumber: Number(page),
    },
    select: {
      pageNumber: true,
      url: true,
      images: {
        select: {
          id: true,
          url: true,
        },
      },
    },
  });

  const totalPage = await prisma.page.count();
  const previousCursor = Number(page) - 1 === 0 ? null : Number(page) - 1;
  const nextCursor = Number(page) + 1 > totalPage ? null : Number(page) + 1;

  const metadata = {
    previousCursor,
    nextCursor,
  };

  return NextResponse.json({ metadata, data: pageData });
}
