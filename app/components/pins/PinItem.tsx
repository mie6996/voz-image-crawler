import Image from "next/image";
import React from "react";
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
        className="rounded-3xl 
        cursor-pointer relative z-0"
        blurDataURL={pin.url}
        loading="lazy"
        placeholder="blur"
      />
    </div>
  );
}

export default PinItem;
