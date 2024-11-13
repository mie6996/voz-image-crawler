"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

function Header() {
  const router = useRouter();

  return (
    <div className="flex gap-3 md:gap-2 items-center p-6 justify-between">
      <Image
        src="/logo.png"
        alt="logo"
        width={50}
        height={50}
        onClick={() => router.push("/")}
        className="hover:bg-gray-300 p-2 rounded-full cursor-pointer"
        priority
      />
      <Button>Home</Button>
    </div>
  );
}

export default Header;
