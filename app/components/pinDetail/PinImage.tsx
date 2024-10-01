import Image from "next/image";
import React from "react";

function PinImage({
  pinDetail,
}: {
  pinDetail: {
    id: string;
    url: string;
  };
}) {
  return (
    <div>
      <Image
        src={pinDetail.url}
        alt={pinDetail.url}
        width={1000}
        height={1000}
        className="rounded-2xl"
        blurDataURL={pinDetail.url}
        loading="lazy"
      />
    </div>
  );
}

export default PinImage;
