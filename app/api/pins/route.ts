import { prisma } from "@/app/lib/prisma";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = searchParams.get("page") || "1";

  const pageData = await prisma.page.findFirst({
    where: {
      pageNumber: Number(page),
    },
    include: {
      images: true,
    },
  });

  const totalPages = await prisma.page.count();

  const metadata = {
    page: pageData?.pageNumber,
    size: pageData?.images.length,
    totalPages,
  };

  return NextResponse.json({ pageData, metadata });
}
