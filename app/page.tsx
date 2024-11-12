"use client";

import { useCallback, Suspense, useEffect, useRef } from "react";
import PinList, { Pin } from "./components/pin/PinList";
import axios from "axios";
import { useInfiniteQuery } from "@tanstack/react-query";
import Spinner from "./components/commons/Spinner";
import classNames from "classnames";
import { useInView } from "react-intersection-observer";

interface Page {
  data: {
    url: string;
    images: Pin[];
  };
  metadata: {
    offset: number;
    hasPrevPage: boolean;
    hasNextPage: boolean;
  };
}

function HomeContent() {
  const [ref, inView] = useInView();
  // page url is useRef
  const pageUrlRef = useRef<String>(
    "https://voz.vn/t/no-sex-vitamin-gai-xinh-moi-ngay-cho-doi-mat-sang-khoe-dep.783806/"
  );

  const getAllPins = useCallback(
    async ({
      pageParam = {
        pageUrl: pageUrlRef.current,
        offset: 0,
      },
    }) => {
      const { pageUrl, offset } = pageParam;
      const data = await axios.post<Page>(
        `${
          process.env.NEXT_PUBLIC_API_URL
        }/images?limit=${50}&offset=${offset}`,
        {
          pageUrl,
        }
      );
      return data.data;
    },
    []
  );

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage, // boolean
    isError,
    isFetchingNextPage,
    status, // "loading" | "error" | "success"
  } = useInfiniteQuery({
    queryKey: ["pins"],
    queryFn: getAllPins,
    initialPageParam: {
      pageUrl: pageUrlRef.current,
      offset: 0,
    },
    getNextPageParam: (lastPage: Page, pages: Page[]) =>
      lastPage.metadata.hasNextPage
        ? { pageUrl: pageUrlRef.current, offset: lastPage.metadata.offset + 1 }
        : undefined,
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView]);

  if (status === "pending") {
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

  if (isError) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <>
      <div className="p-3">
        {data.pages.map((group, i) => (
          <PinList pins={group.data.images} key={i} />
        ))}
      </div>
      {/* Pagination Controls */}
      <div className="text-center p-4">
        <button
          ref={ref}
          disabled={!hasNextPage || isFetchingNextPage}
          onClick={() => fetchNextPage()}
        >
          {isFetchingNextPage ? (
            <Spinner className="bg-opacity-0" />
          ) : hasNextPage ? (
            "Fetch More Data"
          ) : (
            "No more data"
          )}
        </button>
      </div>
    </>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<Spinner className="bg-opacity-0" />}>
      <HomeContent />
    </Suspense>
  );
}
