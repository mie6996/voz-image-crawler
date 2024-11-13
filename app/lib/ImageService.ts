import { ignoreLinks } from "./constants";
import { prisma } from "./prisma";

export class ImageService {
  // Get images from the original page
  static async getImages(parentPageId: number, currentPageNumber: number) {
    currentPageNumber = Math.max(currentPageNumber, 1);

    const parentPage = await prisma.parentPage.findFirst({
      where: { id: parentPageId },
    });

    if (!parentPage) {
      return { images: [], maxPage: 0 };
    }

    const page = await prisma.page.findFirst({
      where: {
        parentId: parentPageId,
        pageNumber: currentPageNumber,
      },
    });

    if (!page) {
      return { images: [], maxPage: parentPage.maxPage };
    }

    const images = await prisma.image.findMany({
      where: {
        pageId: page.id,
      },
      select: { id: true, url: true },
    });

    return { images, maxPage: parentPage.maxPage };
  }

  static async getMaxPage(url: string) {
    const res = await fetch(url);
    const html = await res.text();
    const maxPage = html.match(/min="1" max="(\d+)"/)?.[1];
    return Number(maxPage);
  }

  static async crawlImages(url: string) {
    console.time("Crawling images for " + url);

    const parentPage = await prisma.parentPage.findFirst({ where: { url } });
    const maxPage = await this.getMaxPage(url);

    if (parentPage && parentPage.maxPage >= maxPage) {
      return { message: `Images are already crawled for ${url}` };
    }

    const res = await fetch(url);
    const html = await res.text();
    const title = html.match(/<title>([^<]+)<\/title>/)?.[1] ?? "Unknown";
    const currentMaxPage = parentPage?.maxPage ?? 1;

    if (currentMaxPage >= maxPage) {
      return { message: `Images are already crawled for ${url}` };
    }

    const promises = Array.from({ length: maxPage - currentMaxPage }, (_, i) =>
      this.processPage(url, title, currentMaxPage + i + 1, maxPage)
    );

    const LIMIT = 10;
    for (let i = 0; i < promises.length; i += LIMIT) {
      await Promise.all(promises.slice(i, i + LIMIT));
    }

    console.timeEnd("Crawling images for " + url);
    return { message: `Images are crawled for ${url}` };
  }

  static async processPage(
    url: string,
    title: string,
    pageNumber: number,
    maxPage: number
  ) {
    const data = await this.getImagesByPageNumber(url, pageNumber);

    const parentPage = await prisma.parentPage.upsert({
      where: { url },
      update: { maxPage },
      create: { url, title, maxPage },
    });

    await prisma.page.upsert({
      where: {
        parentId_pageNumber: {
          parentId: parentPage.id,
          pageNumber,
        },
      },
      update: {
        images: {
          create: data.images,
        },
      },
      create: {
        pageNumber,
        parentId: parentPage.id,
        images: {
          create: data.images,
        },
      },
    });
  }

  static async getImagesByPageNumber(url: string, pageNumber: number) {
    const pageUrl = `${url}page-${pageNumber}`;
    const res = await fetch(pageUrl);
    const html = await res.text();

    const imageTags = html.match(/<img[^>]+>/g) || [];
    const imageLinks = imageTags
      .map((image) => image.match(/src="([^"]+)"|data-url="([^"]+)"/)?.[1])
      .filter(
        (link) =>
          link && !ignoreLinks.some((ignoreLink) => link.includes(ignoreLink))
      );

    const images = imageLinks
      .filter((link): link is string => !!link)
      .map((link) => ({ url: link }));

    return { images };
  }
}
