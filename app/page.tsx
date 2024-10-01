"use client";

import { useCallback, Suspense, useEffect } from "react";
import PinList, { Pin } from "./components/pins/PinList";
import axios from "axios";
import { useInfiniteQuery } from "@tanstack/react-query";
import Spinner from "./components/commons/Spinner";
import classNames from "classnames";
import React from "react";
import { useInView } from "react-intersection-observer";

interface Page {
  data: {
    images: Pin[];
  };
  metadata: {
    previousCursor?: number;
    nextCursor?: number;
  };
}

function HomeContent() {
  const [ref, inView] = useInView();

  const getAllPins = useCallback(
    async ({ pageParam }: { pageParam: number }) => {
      const data = await axios.get<Page>(
        `${process.env.NEXT_PUBLIC_API_URL}/pins?page=${pageParam}`
      );
      return data.data;
    },
    []
  );

  const {
    data, // InfiniteQueryData<Page>
    error, // Error
    fetchNextPage,
    hasNextPage, // boolean
    isError,
    isFetchingNextPage,
    status, // "loading" | "error" | "success"
  } = useInfiniteQuery({
    queryKey: ["pins"],
    queryFn: getAllPins,
    initialPageParam: 1,
    getNextPageParam: (lastPage: Page, pages: Page[]) =>
      lastPage.metadata.nextCursor,
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
