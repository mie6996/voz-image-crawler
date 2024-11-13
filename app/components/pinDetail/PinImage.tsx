import Image from "next/image";

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
        blurDataURL={pinDetail.url}
        loading="lazy"
        className="rounded-2xl shadow-lg max-w-prose"
      />
    </div>
  );
}

export default PinImage;
