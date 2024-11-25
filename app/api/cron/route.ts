import { NextResponse } from "next/server";
import { noSexLinks } from "../../lib/constants";
import winston from "winston";
import { ImageService } from "../../lib/ImageService";

const baseURL = "https://voz.vn/f/chuyen-tro-linh-tinh%E2%84%A2.17";

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [new winston.transports.Console()],
});

export async function GET(request: Request, context: any) {
  logger.info("Crawling images");

  const promises = [];
  for (let pageNumber = 1; pageNumber <= 100; pageNumber++) {
    promises.push(fetchPageData(baseURL, pageNumber));
  }

  const results = await Promise.all(promises);
  const data = results.flat();

  const imageCrawlPromises = data.map(async (item) => {
    const url = `https://voz.vn${item.url}`;
    logger.info(`Crawling images for ${url}`);
    return ImageService.crawlImages(url);
  });

  await Promise.all(imageCrawlPromises);

  // The response object contains a message and the crawled data
  // message: A string indicating the status of the crawling process
  // data: An array of objects containing the URLs of the crawled pages
  return NextResponse.json({
    message: "Crawling images completed successfully",
    data,
  });
}
const fetchPageData = async (baseURL: string, pageNumber: number) => {
  const pageUrl = `${baseURL}/page-${pageNumber}`;
  const res = await fetch(pageUrl);
  const html = await res.text();

  const regex =
    /<div class="structItem-title">[\s\S]*?<a href="(.*?)"[\s\S]*?>(.*?)<\/a>[\s\S]*?<\/div>/g;
  let matches;
  const pageData = [];
  while ((matches = regex.exec(html))) {
    const url = matches[1];
    if (!noSexLinks.some((noSexLink) => url.includes(noSexLink))) {
      continue;
    }
    pageData.push({ url });
  }
  return pageData;
};
