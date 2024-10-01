"use client";

import { useCallback } from "react";
import PinList from "./components/pins/PinList";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

export default function Home() {
  const getAllPins = useCallback(async () => {
    const data = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/pins`);
    return data;
  }, []);

  // Queries
  const query = useQuery({ queryKey: ["pins"], queryFn: getAllPins });

  const { isLoading, error, data } = query;

  if (isLoading) return toast.loading("Loading...");

  if (error) return toast.error("An error has occurred: " + error.message);

  const listOfPins = data?.data;
  return (
    <div className="p-3">
      <PinList listOfPins={listOfPins} />
    </div>
  );
}
