import { NextResponse } from "next/server";
import { noSexLinks } from "../../lib/constants";
import { ImageService } from "../../lib/ImageService";

export async function GET(request: Request, context: any) {
  console.log("Crawling images");
  const baseURL = "https://voz.vn/f/chuyen-tro-linh-tinh%E2%84%A2.17";

  const promises = [];
  for (let pageNumber = 1; pageNumber <= 100; pageNumber++) {
    promises.push(fetchPageData(baseURL, pageNumber));
  }

  const results = await Promise.all(promises);
  const data = results.flat();

  const promises2: Promise<any>[] = [];
  data.forEach(async (item) => {
    const url = "https://voz.vn" + item.url;
    console.log("Crawling images for", url);
    promises2.push(ImageService.crawlImages(url));
  });

  await Promise.all(promises2);

  return NextResponse.json({ message: "Crawling images", data });
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
