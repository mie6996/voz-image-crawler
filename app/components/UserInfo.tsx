"use client";

import { DocumentData } from "firebase/firestore";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";

interface UserInfoParams {
  userInfo: DocumentData;
}

function UserInfo({ userInfo }: UserInfoParams) {
  const router = useRouter();
  const { data: session } = useSession();

  const onLogoutClick = () => {
    signOut();
    router.push("/");
  };

  return (
    <div className="flex flex-col items-center">
      <Image
        src={userInfo.userImage || ""}
        alt="userImage"
        width={100}
        height={100}
        className="rounded-full "
      />

      <h2 className="text-[30px] font-semibold">{userInfo.userName}</h2>
      <h2 className="text-gray-400">{userInfo.email}</h2>

      <div className="flex gap-4">
        <button className="bg-gray-200 p-2 px-3 rounded-full font-semibold mt-5">
          Share
        </button>
        {session?.user?.email === userInfo.email ? (
          <button
            onClick={() => onLogoutClick()}
            className="bg-gray-200 p-2 px-3 rounded-full font-semibold mt-5"
          >
            Logout
          </button>
        ) : null}
      </div>
    </div>
  );
}

export default UserInfo;
