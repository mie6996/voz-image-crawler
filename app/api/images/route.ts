import { NextRequest, NextResponse } from "next/server";
import { ImageService } from "../../lib/ImageService";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const url = searchParams.get("url");
  const currentPageNumber = parseInt(
    searchParams.get("currentPageNumber") ?? "1"
  );

  if (!url) {
    return NextResponse.json({
      message: "URL is required",
    });
  }

  // Validate the page URL
  if (url && !url.includes("voz.vn/t/")) {
    return NextResponse.json({
      message: "Invalid url",
    });
  }

  // get images from original page
  const { images, maxPage } = await ImageService.getImages(
    url,
    currentPageNumber
  );

  const data = {
    message: images.length > 0 ? "Success" : "No images found",
    url,
    currentPageNumber,
    maxPage,
    images,
  };

  return NextResponse.json(data);
}
