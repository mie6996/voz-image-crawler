import { ImageService } from "@/app/lib/ImageService";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const url = searchParams.get("url") ?? "";
  (await ImageService.crawlImages(url)) ?? "Unknown";
  console.log("🚀 ~ GET ~ url:", url);

  return NextResponse.json({
    message: "Crawling images",
  });
}
