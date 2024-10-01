"use client";

import { useCallback, useState } from "react";
import PinList from "./components/pins/PinList";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import Spinner from "./components/commons/Spinner";
import { useRouter, useSearchParams } from "next/navigation";
import classNames from "classnames";
import Pagination from "./components/commons/Pagination";

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // For the pagination
  const [pageNumberLimit, setPageNumberLimit] = useState(10);
  const [minPageNumberLimit, setMinPageNumberLimit] = useState(0);
  const [maxPageNumberLimit, setMaxPageNumberLimit] = useState(10);

  const [page, setPage] = useState(1);

  const offset = parseInt(searchParams.get("page") || "1", 10);

  const getAllPins = useCallback(
    async ({ queryKey }: { queryKey: [string, number] }) => {
      const [, offset] = queryKey;
      const data = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/pins?page=${offset}`
      );
      return data;
    },
    []
  );

  // Queries
  const query = useQuery({
    queryKey: ["pins", offset],
    queryFn: getAllPins,
  });

  const { isLoading, data } = query;

  if (isLoading) {
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

  const listOfPins = data?.data.pageData.images || [];
  const totalPages = data?.data.metadata.totalPages || 0;
  const pageSize = data?.data.metadata.size || 0;

  const changePage = (pageNumber: number) => {
    setPage(pageNumber);
    router.push(`/?page=${pageNumber}`);
  };

  const incrementPage = () => {
    setPage(page + 1);
    if (page + 1 > maxPageNumberLimit) {
      setMaxPageNumberLimit(maxPageNumberLimit + pageNumberLimit);
      setMinPageNumberLimit(minPageNumberLimit + pageNumberLimit);
    }
    router.push(`/?page=${page + 1}`);
  };

  const decrementPage = () => {
    setPage(page - 1);
    if ((page - 1) % pageNumberLimit === 0) {
      setMaxPageNumberLimit(maxPageNumberLimit - pageNumberLimit);
      setMinPageNumberLimit(minPageNumberLimit - pageNumberLimit);
    }
    if (page - 1 === 0) {
      return null;
    }
    router.push(`/?page=${page - 1}`);
  };

  return (
    <div className="p-3">
      <Pagination
        totalPages={totalPages}
        pageSize={pageSize}
        page={offset}
        changePage={changePage}
        incrementPage={incrementPage}
        decrementPage={decrementPage}
        minPageNumberLimit={minPageNumberLimit}
        maxPageNumberLimit={maxPageNumberLimit}
      />
      <PinList pins={listOfPins} />
    </div>
  );
}
