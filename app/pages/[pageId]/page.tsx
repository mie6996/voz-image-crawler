"use client";

import { useCallback, useRef } from "react";
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
  // page url is useRef
  const pageId = params.pageId;
  const currentPageNumberRef = useRef(1);

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
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" isActive>
              2
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">3</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
      {/* {<PinList images={data.images} />} */}
    </>
  );
}

export default PageDetail;
