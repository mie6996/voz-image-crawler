import Image from "next/image";
import { useRouter } from "next/navigation";
import { ImageType } from "./ImageList";

interface Props {
  image: ImageType;
}

function PinItem({ image }: Props) {
  const router = useRouter();

  return (
    <div
      className="relative 
       before:absolute
       before:h-full before:w-full
       before:rounded-3xl
       before:z-10
       hover:before:bg-gray-600 
       before:opacity-50
       cursor-pointer
       "
      onClick={() => router.push("/pin/" + image.id)}
    >
      <Image
        src={image.url}
        alt={image.url}
        width={500}
        height={500}
        blurDataURL={image.url}
        data-loaded="false"
        onLoad={(event) => {
          event.currentTarget.setAttribute("data-loaded", "true");
        }}
        className="data-[loaded=false]:animate-pulse data-[loaded=false]:bg-gray-100/10 rounded-3xl 
        cursor-pointer relative z-0"
      />
    </div>
  );
}

export default PinItem;
