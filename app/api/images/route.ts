import { prisma } from "@/app/lib/prisma";
import { RedisService } from "@/app/lib/RedisService";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const offset = parseInt(searchParams.get("offset") || "0", 10);

  const body = await request.json();
  const pageUrl = body.pageUrl;

  // https://voz.vn/t/no-sex-vitamin-gai-xinh-moi-ngay-cho-doi-mat-sang-khoe-dep.783806/
  // https://voz.vn/t/no-sex-vitamin-gai-xinh-moi-ngay-cho-doi-mat-sang-khoe-dep.783806/page-1
  // validate page url
  if (!pageUrl.includes("voz.vn/t/")) {
    return NextResponse.json({
      message: "Invalid url",
    });
  }

  const originalPage = pageUrl.split("/page-")[0];

  const pageKey = RedisService.generateKey(
    "page",
    encodeURIComponent(originalPage),
    String(offset),
    String(limit)
  );
  try {
    if (await RedisService.hasKey(pageKey)) {
      return NextResponse.json(await RedisService.getKey(pageKey));
    }
  } catch (e) {
    if (e instanceof Error) {
      console.error(
        "[Redis] Could not connect to Redis due to error " + e.message
      );
    } else {
      console.error(
        "[Redis] Could not connect to Redis due to an unknown error"
      );
    }
  }

  // get images from original page
  const page = await prisma.page.findFirst({
    where: {
      url: originalPage,
    },
  });

  if (page === null) {
    const images = await getImageFromOriginalUrl(pageUrl);

    if (images.length === 0) {
      return NextResponse.json({
        message: "No images found",
      });
    }

    await prisma.page.create({
      data: {
        url: pageUrl.toString(),
        images: {
          createMany: {
            data: images,
          },
        },
      },
    });
  }

  const [images, totalImage] = await Promise.all([
    prisma.page.findFirst({
      where: {
        url: pageUrl.toString(),
      },
      select: {
        url: true,
        images: {
          select: {
            id: true,
            url: true,
          },
          skip: offset * limit,
          take: limit,
        },
      },
    }),
    page
      ? prisma.image.count({
          where: {
            pageId: page.id,
          },
        })
      : Promise.resolve(0),
  ]);

  const metadata = {
    hasNextPage: offset * limit + limit < totalImage,
    hasPrevPage: offset > 0,
    offset,
  };

  const result = { data: images, metadata };

  try {
    await RedisService.setKey(pageKey, JSON.stringify(result));
  } catch (e) {
    if (e instanceof Error) {
      console.error(
        "[Redis] Could not connect to Redis due to error " + e.message
      );
    } else {
      console.error(
        "[Redis] Could not connect to Redis due to an unknown error"
      );
    }
  }

  return NextResponse.json(result);
}

const getImageFromOriginalUrl = async (url: string) => {
  const res = await fetch(url);
  const html = await res.text();

  // get max page number
  const maxPage = html.match(/min="1" max="(\d+)"/)?.[1];

  let imageTags: string[] = [];

  // get images from all pages
  for (let i = 1; i <= Number(maxPage); i++) {
    const pageUrl = i === 1 ? url.toString() : `${url}page-${i}`;

    const res = await fetch(pageUrl);
    const html = await res.text();

    // get all images in image tag and filter "src" or "data-url" attribute
    const matches = html.match(/<img[^>]+>/g);
    if (matches) {
      imageTags.push(...matches);
    }
  }

  const filteredImages = imageTags?.filter((image) => {
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

  const images = imageLinks
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

  return images;
};
