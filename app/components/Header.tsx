"use client";

import Image from "next/image";
import { HiSearch } from "react-icons/hi";
import { useRouter } from "next/navigation";

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
      <button className="bg-black text-white p-2 rounded-full px-4">
        Home
      </button>

      <div className="bg-[#e9e9e9] p-3 gap-3 items-center rounded-full w-full hidden md:flex">
        <HiSearch className="text-[25px] text-gray-500 md:hidden" />
        <input
          className="bg-transparent outline-none w-full"
          type="text"
          placeholder="Search"
        />
      </div>
    </div>
  );
}

export default Header;
