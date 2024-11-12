import { NextRequest, NextResponse } from "next/server";
import { ImageService } from "../../../lib/ImageService";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const url = searchParams.get("url") ?? "";
  const { message } = await ImageService.crawlImages(url);

  return NextResponse.json({
    message,
  });
}
