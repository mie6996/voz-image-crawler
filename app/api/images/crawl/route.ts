import { NextRequest, NextResponse } from "next/server";
import { ImageService } from "../../../lib/ImageService";

export async function GET(request: NextRequest) {
  // get the URL from the query parameters
  const url = request.nextUrl.searchParams.get("url");

  if (!url) {
    return NextResponse.json({ message: "URL is required" }, { status: 400 });
  }

  // get images from original page
  const { message } = await ImageService.crawlImages(url);

  return NextResponse.json({ message });
}
