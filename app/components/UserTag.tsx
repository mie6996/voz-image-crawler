"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import React from "react";

interface Props {
  user?: {
    name: string;
    image: string;
  };
}

function UserTag({ user }: Props) {
  const { data: session } = useSession();
  return (
    <div className="mt-8">
      {session ? (
        <div>
          <Image
            src={session?.user?.image || ""}
            alt="userImage"
            width={50}
            height={50}
            className="rounded-full"
          />
          <div>
            <h2 className="text-[14px] font-medium">{session.user?.name}</h2>
            <h2 className="text-[12px]">{session.user?.email}</h2>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default UserTag;
