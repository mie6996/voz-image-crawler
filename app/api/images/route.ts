import { NextRequest, NextResponse } from "next/server";
import { ImageService } from "../../lib/ImageService";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const pageId = parseInt(searchParams.get("pageId") ?? "0");
  const currentPageNumber = parseInt(
    searchParams.get("currentPageNumber") ?? "1"
  );

  // get images from original page
  const { images, maxPage } = await ImageService.getImages(
    pageId,
    currentPageNumber
  );

  const data = {
    message: images.length > 0 ? "Success" : "No images found",
    currentPageNumber,
    maxPage,
    images,
  };

  return NextResponse.json(data);
}
