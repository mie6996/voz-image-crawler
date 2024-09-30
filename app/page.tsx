"use client";

import { useCallback, useEffect, useState } from "react";
import PinList from "./components/pins/PinList";
import toast from "react-hot-toast";
import axios from "axios";

export default function Home() {
  const [listOfPins, setListOfPins] = useState<any>([]);

  useEffect(() => {
    getAllPins();
  }, []);

  const getAllPins = useCallback(async () => {
    setListOfPins([]);
    const data = axios.get("http://localhost:3000/api/pins");

    // const querySnapshot = await getDocs(q);
    toast
      .promise(data, {
        loading: "Loading...",
        success: "Data loaded",
        error: "An error occurred",
      })
      .then((res) => {
        setListOfPins(res.data);
      });
  }, []);

  return (
    <div className="p-3">
      <PinList listOfPins={listOfPins} />
    </div>
  );
}
