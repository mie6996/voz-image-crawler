"use client";

import { collection, getDocs, getFirestore, query } from "firebase/firestore";
import app from "./shared/firebaseConfig";
import { useCallback, useEffect, useState } from "react";
import PinList from "./components/pins/PinList";
import toast from "react-hot-toast";

export default function Home() {
  const db = getFirestore(app);
  const [listOfPins, setListOfPins] = useState<any>([]);

  useEffect(() => {
    getAllPins();
  }, []);

  const getAllPins = useCallback(async () => {
    setListOfPins([]);
    const q = query(collection(db, "pinterest-post"));

    // const querySnapshot = await getDocs(q);
    toast
      .promise(getDocs(q), {
        loading: "Loading",
        success: "Data loaded",
        error: "Error",
      })
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          const data = doc.data();

          // double data to show the same data twice
          const data2 = { ...data, id: data.id + "2" };
          // randomize the order of the data2
          setListOfPins((prev: any) => [...prev, data2]);
        });
      });
  }, [db]);

  return (
    <div className="p-3">
      <PinList listOfPins={listOfPins} />
    </div>
  );
}
