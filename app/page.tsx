"use client";

import { useCallback } from "react";
import PinList from "./components/pins/PinList";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import Spinner from "./components/commons/Spinner";
import classNames from "classnames";

export default function Home() {
  const getAllPins = useCallback(async () => {
    const data = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/pins`);
    return data;
  }, []);

  // Queries
  const query = useQuery({ queryKey: ["pins"], queryFn: getAllPins });

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

  const listOfPins = data?.data;
  return (
    <div className="p-3">
      <PinList listOfPins={listOfPins} />
    </div>
  );
}
