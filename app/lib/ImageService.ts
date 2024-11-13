import { ignoreLinks } from "./constants";
import { prisma } from "./prisma";

export class ImageService {
  // Get images from the original page
  static async getImages(parentPageId: number, currentPageNumber: number) {
    // Validate current page number
    if (currentPageNumber < 1) {
      currentPageNumber = 1;
    }

    // Check if the page exists in the database
    const parentPage = await prisma.parentPage.findFirst({
      where: {
        id: parentPageId,
      },
    });

    if (!parentPage) {
      return {
        images: [],
        maxPage: 0,
      };
    }

    const page = await prisma.page.findFirst({
      where: {
        parent: {
          id: parentPageId,
        },
        pageNumber: currentPageNumber,
      },
    });

    if (!page) {
      return {
        images: [],
        maxPage: parentPage.maxPage,
      };
    }

    const images = await prisma.image.findMany({
      where: {
        page: {
          parent: {
            id: parentPageId,
          },
          pageNumber: currentPageNumber,
        },
      },
      select: {
        id: true,
        url: true,
      },
    });

    return {
      images,
      maxPage: parentPage?.maxPage,
    };
  }

  static getMaxPage = async (url: string) => {
    const res = await fetch(url);
    const html = await res.text();

    const maxPage = html.match(/min="1" max="(\d+)"/)?.[1];

    return Number(maxPage);
  };

  static crawlImages = async (url: string) => {
    console.time("Crawling images for " + url);
    const parentPage = await prisma.parentPage.findFirst({
      where: {
        url,
      },
    });

    if (parentPage && parentPage.maxPage >= (await this.getMaxPage(url))) {
      return {
        message: `Images are already crawled for ${url}`,
      };
    }

    const res = await fetch(url);
    const html = await res.text();

    const title = html.match(/<title>([^<]+)<\/title>/)?.[1] ?? "Unknown";
    // get max page number
    const maxPage = html.match(/min="1" max="(\d+)"/)?.[1];
    const currentMaxPage = parentPage?.maxPage ?? 0;

    // if max page is not changed, return
    if (currentMaxPage >= Number(maxPage)) {
      return {
        message: `Images are already crawled for ${url}`,
      };
    }

    // get images from all pages
    const promises = Array.from(
      { length: Number(maxPage) - currentMaxPage },
      (_, i) =>
        (async () => {
          const data = await ImageService.getImagesByPageNumber(
            url,
            currentMaxPage + i + 1
          );

          // save parent page
          const parentPage = await prisma.parentPage.upsert({
            where: {
              url,
            },
            update: {
              maxPage: Number(maxPage),
            },
            create: {
              url,
              title,
              maxPage: Number(maxPage),
            },
          });

          // save images to database
          await prisma.page.upsert({
            where: {
              parentId_pageNumber: {
                parentId: parentPage.id,
                pageNumber: i + 1,
              },
            },
            update: {
              images: {
                create: data.images,
              },
            },
            create: {
              pageNumber: i + 1,
              parent: {
                connect: {
                  url,
                },
              },
              images: {
                create: data.images,
              },
            },
          });
        })()
    );

    await Promise.all(promises);

    // Update max page
    await prisma.parentPage.update({
      where: {
        id: parentPage?.id,
      },
      data: {
        maxPage: Number(maxPage),
      },
    });

    console.timeEnd("Crawling images for " + url);

    return {
      message: `Images are crawled for ${url}`,
    };
  };

  static getImagesByPageNumber = async (url: string, pageNumber: number) => {
    let imageTags: string[] = [];
    const pageUrl = `${url}page-${pageNumber}`;

    const res = await fetch(pageUrl);
    const html = await res.text();

    // get all images in image tag and filter "src" or "data-url" attribute
    const matches = html.match(/<img[^>]+>/g);
    if (matches) {
      imageTags.push(...matches);
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
        if (
          link &&
          ignoreLinks.some((ignoreLink) => link.includes(ignoreLink) || !link)
        ) {
          return false;
        }

        return link;
      })
      .map((link) => {
        return {
          url: link,
        };
      }) as { url: string }[];

    return {
      images,
    };
  };
}
