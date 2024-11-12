"use client";

import { useCallback, Suspense, useRef } from "react";
import Card, { PageType } from "./components/commons/Card";
import axios from "axios";
import Spinner from "./components/commons/Spinner";
import classNames from "classnames";
import { useQuery } from "@tanstack/react-query";

interface PagesResponse {
  message: string;
  pages: PageType[];
}
function HomeContent() {
  // page url is useRef

  const { isPending, error, data } = useQuery({
    queryKey: ["pages"],
    queryFn: async () => {
      const { data } = await axios.get<PagesResponse>(
        `${process.env.NEXT_PUBLIC_API_URL}/pages`
      );
      return data;
    },
  });

  console.log(data);

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
    <div className="flex flex-wrap justify-center gap-4">
      {data.pages.map((item) => (
        <Card key={item.id} item={item} />
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<Spinner className="bg-opacity-0" />}>
      <HomeContent />
    </Suspense>
  );
}
