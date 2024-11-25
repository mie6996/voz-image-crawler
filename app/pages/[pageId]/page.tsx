"use client";

import { useCallback, useState, useEffect, useReducer, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import classNames from "classnames";
import { useRouter } from "next/navigation";
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

interface PageMetadata {
  currentPageNumber: number;
  totalPage: number;
  title: string;
}

interface Page {
  message: string;
  images: ImageType[];
  metadata: PageMetadata;
}

function PageDetail({ params }: any) {
  const router = useRouter();
  const pageId = params.pageId;
  const pageNumber = parseInt(params.pageNumber) || 1;
  const currentPageNumberRef = useRef(pageNumber);

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
    queryKey: ["images", pageId, currentPageNumberRef.current],
    queryFn: () => getAllPins(currentPageNumberRef.current),
  });

  const handlePageChange = (newPageNumber: number) => {
    currentPageNumberRef.current = newPageNumber;
    router.push(`/pages/${pageId}?pageNumber=${newPageNumber}`);
  };

  useEffect(() => {
    currentPageNumberRef.current = pageNumber;
  }, [pageNumber]);

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
      <div className="flex flex-col justify-center items-center space-y-10">
        <h2 className="text-3xl mx-8 md:mx-0 text-center">
          {data.metadata.title}
        </h2>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                aria-disabled={currentPageNumberRef.current <= 1}
                onClick={() =>
                  currentPageNumberRef.current > 1 &&
                  handlePageChange(currentPageNumberRef.current - 1)
                }
                className={
                  currentPageNumberRef.current <= 1
                    ? "pointer-events-none opacity-50"
                    : undefined
                }
              />
            </PaginationItem>
            {data.metadata.totalPage > 1 && (
              <PaginationItem>
                <PaginationLink
                  href="#"
                  isActive={currentPageNumberRef.current === 1}
                  onClick={() => handlePageChange(1)}
                >
                  1
                </PaginationLink>
              </PaginationItem>
            )}
            {createPaginationItems(
              currentPageNumberRef.current,
              data.metadata.totalPage
            )}
            <PaginationItem>
              <PaginationLink
                href="#"
                isActive={
                  currentPageNumberRef.current === data.metadata.totalPage
                }
                onClick={() => handlePageChange(data.metadata.totalPage)}
              >
                {data.metadata.totalPage}
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              {currentPageNumberRef.current < data.metadata.totalPage && (
                <PaginationNext
                  href="#"
                  onClick={() =>
                    handlePageChange(currentPageNumberRef.current + 1)
                  }
                />
              )}
            </PaginationItem>
          </PaginationContent>
        </Pagination>
        {
          // check if there are images
          data.images.length > 0 ? (
            <PinList images={data.images} />
          ) : (
            <div>No images found</div>
          )
        }
      </div>
    </>
  );
}

export default PageDetail;
