import { url } from "inspector";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const url = new URL(
    "https://voz.vn/t/no-sex-vitamin-gai-xinh-moi-ngay-cho-doi-mat-sang-khoe-dep.783806/"
  );

  const res = await fetch(url.toString());
  const html = await res.text();
  // const maxPage = html.match(/min="1" max="(\d+)"/)?.[1];
  const maxPage = 100;

  const images = await Promise.all(
    Array.from({ length: Number(maxPage) }, (_, i) => {
      return getImageFromUrl(url.toString(), i + 1);
    })
  ).then((res) => {
    return res.flat();
  });

  return NextResponse.json(images);
}

const getImageFromUrl = async (url: string, page: number) => {
  const pageUrl = new URL(url + `page-${page}`);
  const res = await fetch(pageUrl.toString());
  const html = await res.text();

  // get all images in image tag and filter "src" or "data-url" attribute
  const images = html.match(/<img[^>]+>/g);

  const filteredImages = images?.filter((image) => {
    const srcMatch = image.match(/src="([^"]+)"/);
    const dataUrlMatch = image.match(/data-url="([^"]+)"/);

    if (srcMatch || dataUrlMatch) {
      return image;
    }
  });

  // get all links of images
  const imageLinks = filteredImages?.map((image) => {
    const srcMatch = image.match(/src="([^"]+)"/);
    const dataUrlMatch = image.match(/data-url="([^"]+)"/);

    if (dataUrlMatch) {
      return dataUrlMatch[1];
    }

    if (srcMatch) {
      return srcMatch[1];
    }
  });

  const xxxx = imageLinks
    ?.filter((link) => {
      if (link?.includes("/styles") || link?.includes("/avatars")) {
        return false;
      }

      return link;
    })
    .map((link) => {
      return {
        url: link,
      };
    });

  return xxxx;
};
