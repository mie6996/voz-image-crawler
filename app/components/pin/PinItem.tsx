import Image from "next/image";
import { useRouter } from "next/navigation";
import { Pin } from "./PinList";

interface Props {
  pin: Pin;
}

function PinItem({ pin }: Props) {
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
      onClick={() => router.push("/pin/" + pin.id)}
    >
      <Image
        src={pin.url}
        alt={pin.url}
        width={500}
        height={500}
        blurDataURL={pin.url}
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
