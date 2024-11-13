"use client";

import { useCallback, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import classNames from "classnames";
import Spinner from "../../components/commons/Spinner";
import PinList, { ImageType } from "../../components/pin/ImageList";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface Page {
  message: string;
  url: string;
  currentPageNumber: number;
  maxPage: number;
  images: ImageType[];
}

function PageDetail({ params }: any) {
  const pageId = params.pageId;
  const [currentPageNumber, setCurrentPageNumber] = useState(1);

  const getAllPins = useCallback(
    async (currentPageNumber: number) => {
      const data = await axios.get<Page>(
        `${process.env.NEXT_PUBLIC_API_URL}/images?pageId=${pageId}&currentPageNumber=${currentPageNumber}`
      );
      return data.data;
    },
    [pageId]
  );

  const { isPending, error, data } = useQuery({
    queryKey: ["images", pageId, currentPageNumber],
    queryFn: () => getAllPins(currentPageNumber),
  });

  const handlePageChange = (newPageNumber: number) => {
    setCurrentPageNumber(newPageNumber);
  };

  function createPaginationItems(currentPage: number, maxPage: number) {
    const paginationItems = [];
    const delta = 2;
    const range = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(maxPage - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      paginationItems.push(
        <PaginationItem key="ellipsis-prev">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    range.forEach((page) => {
      paginationItems.push(
        <PaginationItem key={page}>
          <PaginationLink
            href="#"
            isActive={page === currentPage}
            onClick={() => handlePageChange(page)}
          >
            {page}
          </PaginationLink>
        </PaginationItem>
      );
    });

    if (currentPage + delta < maxPage - 1) {
      paginationItems.push(
        <PaginationItem key="ellipsis-next">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }

    return paginationItems;
  }

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

  return (
    <>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={() =>
                currentPageNumber > 1 && handlePageChange(currentPageNumber - 1)
              }
            />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink
              href="#"
              isActive={currentPageNumber === 1}
              onClick={() => handlePageChange(1)}
            >
              1
            </PaginationLink>
          </PaginationItem>
          {createPaginationItems(currentPageNumber, data.maxPage)}
          <PaginationItem>
            <PaginationLink
              href="#"
              isActive={currentPageNumber === data.maxPage}
              onClick={() => handlePageChange(data.maxPage)}
            >
              {data.maxPage}
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            {currentPageNumber < data.maxPage && (
              <PaginationNext
                href="#"
                onClick={() => handlePageChange(currentPageNumber + 1)}
              />
            )}
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      {<PinList images={data.images} />}
    </>
  );
}

export default PageDetail;
