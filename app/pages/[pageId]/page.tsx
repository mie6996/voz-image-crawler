"use client";

import { useCallback, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import classNames from "classnames";
import Spinner from "../../components/commons/Spinner";
import PinList, { ImageType } from "../../components/pin/ImageList";

interface Page {
  message: string;
  url: string;
  currentPageNumber: number;
  maxPage: number;
  images: ImageType[];
}

interface PageParam {
  url: string;
  currentPageNumber: number;
}

function PageDetail({ params }: any) {
  // page url is useRef
  const urlRef = useRef<string>(
    "https://voz.vn/t/no-sex-vitamin-gai-xinh-moi-ngay-cho-doi-mat-sang-khoe-dep.783806/"
  );
  const currentPageNumberRef = useRef<number>(1);

  const getAllPins = useCallback(async (pageParam: PageParam) => {
    const { url, currentPageNumber } = pageParam;
    const data = await axios.get<Page>(
      `${process.env.NEXT_PUBLIC_API_URL}/images?url=${url}&currentPageNumber=${currentPageNumber}`
    );
    return data.data;
  }, []);

  const { isPending, error, data } = useQuery({
    queryKey: ["images", urlRef.current, currentPageNumberRef.current],
    queryFn: () =>
      getAllPins({
        url: urlRef.current,
        currentPageNumber: currentPageNumberRef.current,
      }),
  });

  if (isPending) {
    return (
      <div
        className={classNames(
          "fixed inset-0 bg-black bg-opacity-60",
          "flex items-center justify-center",
          "z-50"
        )}
      >
        <Spinner className="bg-opacity-0" />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return <>{<PinList images={data.images} />}</>;
}

export default PageDetail;
