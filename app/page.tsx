"use client";

import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import Image from "next/image";
import app from "./shared/firebaseConfig";
import { useCallback, useEffect, useState } from "react";
import PinList from "./components/pins/PinList";

export default function Home() {
  const db = getFirestore(app);
  const [listOfPins, setListOfPins] = useState<any>([]);

  useEffect(() => {
    getAllPins();
  }, []);

  const getAllPins = useCallback(async () => {
    setListOfPins([]);
    const q = query(collection(db, "pinterest-post"));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      setListOfPins((pins: any) => [...pins, doc.data()]);
    });
  }, [db]);

  return (
    <div className="p-3">
      <PinList listOfPins={listOfPins} />
    </div>
  );
}
