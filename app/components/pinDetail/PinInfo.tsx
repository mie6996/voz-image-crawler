import React from "react";
import { format } from "date-fns";

function PinInfo({
  pinDetail,
}: {
  pinDetail: {
    id: string;
    url: string;
  };
}) {
  return (
    <>
      <h2 className="mt-10">{pinDetail.url}</h2>
      <button
        className="p-2 bg-[#e9e9e9] px-5 text-[23px]
      mt-10 rounded-full hover:scale-105 transition-all"
        onClick={() => window.open(pinDetail.url)}
      >
        Open
      </button>
    </>
  );
}

export default PinInfo;
