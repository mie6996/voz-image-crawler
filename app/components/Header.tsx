"use client";

import { useRouter } from "next/navigation";
import { ModeToggle } from "@/components/ModeToggle";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

function Header() {
  const router = useRouter();

  return (
    <div className="flex gap-3 md:gap-2 items-center p-6 justify-between">
      <Link href="/" className={buttonVariants({ variant: "outline" })}>
        Home
      </Link>
      <ModeToggle />
    </div>
  );
}

export default Header;
