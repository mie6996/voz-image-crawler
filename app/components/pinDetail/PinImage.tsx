import Image from "next/image";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

function PinImage({
  pinDetail,
}: {
  pinDetail: {
    id: string;
    url: string;
  };
}) {
  const router = useRouter();
  return (
    <div className="flex flex-col justify-center items-center relative p-4">
      <Button variant="outline" size="icon" onClick={() => router.back()}>
        <ChevronLeft />
      </Button>
      <Image
        src={pinDetail.url}
        alt={pinDetail.url}
        width={1000}
        height={1000}
        blurDataURL={pinDetail.url}
        loading="lazy"
        className="rounded-2xl shadow-lg max-w-prose w-full m-4 hover:opacity-90 hover:cursor-pointer transition-opacity duration-300"
      />
    </div>
  );
}

export default PinImage;
