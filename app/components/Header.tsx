"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { ModeToggle } from "@/components/ModeToggle";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

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
        className="p-2 rounded-full cursor-pointer hover:bg-primary-foreground hover:bg-opacity-10"
        priority
      />
      <Link href="/" className={buttonVariants({ variant: "outline" })}>
        Home
      </Link>
      <ModeToggle />
    </div>
  );
}

export default Header;
