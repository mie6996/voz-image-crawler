import { prisma } from "@/app/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const url = new URL(
    "https://voz.vn/t/no-sex-vitamin-gai-xinh-moi-ngay-cho-doi-mat-sang-khoe-dep.783806/"
  );

  const res = await fetch(url.toString());
  const html = await res.text();
  const maxPage = html.match(/min="1" max="(\d+)"/)?.[1];

  // get images from all pages
  for (let i = 1; i <= Number(maxPage); i++) {
    const pageUrl = i === 1 ? url.toString() : `${url}page-${i}`;

    const page = await prisma.page.findFirst({
      where: {
        url: pageUrl.toString(),
      },
    });

    if (page === null) {
      const images = await getImageFromUrl(pageUrl);

      if (images.length === 0) {
        continue;
      }

      await prisma.page.create({
        data: {
          url: pageUrl.toString(),
          pageNumber: i,
          images: {
            createMany: {
              data: images,
            },
          },
        },
      });
    }
  }

  return NextResponse.json({
    message: "done",
  });
}

const getImageFromUrl = async (url: string) => {
  const res = await fetch(url);
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
    }) as { url: string }[];

  return xxxx;
};
