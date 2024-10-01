import React from "react";
import PinItem from "./PinItem";

export interface Pin {
  url: string;
  id: string;
}
interface Props {
  pins: Pin[];
}

function PinList({ pins }: Props) {
  return (
    <div className="columns-2 mt-7 px-2 md:px-5 md:columns-3 lg:columns-4 xl:columns-6 space-y-6 mx-auto">
      {pins?.map((item: Pin, index: number) => (
        <PinItem pin={item} key={index} />
      ))}
    </div>
  );
}

export default PinList;
