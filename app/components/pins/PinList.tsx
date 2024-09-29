import { DocumentData } from "firebase/firestore";
import React, { useEffect } from "react";
import PinItem from "./PinItem";

interface Props {
  listOfPins: DocumentData;
}

function PinList({ listOfPins }: Props) {
  return (
    <div className="columns-2 mt-7 px-2 md:px-5 md:columns-3 lg:columns-4 xl:columns-10 space-y-6 mx-auto">
      {listOfPins.map((item: any, index: number) => (
        <PinItem pin={item} key={index} />
      ))}
    </div>
  );
}

export default PinList;
