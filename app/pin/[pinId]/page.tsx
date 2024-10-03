"use client";

import React from "react";
import Spinner from "@/app/components/commons/Spinner";
import PinImage from "@/app/components/pinDetail/PinImage";
import PinInfo from "@/app/components/pinDetail/PinInfo";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import classNames from "classnames";
import { useRouter } from "next/navigation";
import { HiArrowSmallLeft } from "react-icons/hi2";

function PinDetail({ params }: any) {
  const router = useRouter();

  const getPinDetail = async () => {
    const data = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/pins/${params.pinId}`
    );

    return data;
  };

  const { isLoading, data } = useQuery({
    queryKey: ["pin", params.pinId],
    queryFn: getPinDetail,
  });

  if (isLoading) {
    return (
      <div
        className={classNames(
          "fixed inset-0 bg-black bg-opacity-60",
          "flex items-center justify-center",
          "z-50"
        )}
      >
        <Spinner className="bg-opacity-0" />
      </div>
    );
  }

  const pinDetail = data?.data;

  return (
    <>
      {pinDetail ? (
        <div className=" bg-white p-3 md:p-12 rounded-2xl md:px-24 lg:px-36">
          <HiArrowSmallLeft
            className="text-[60px] font-bold ml-[-50px] 
       cursor-pointer hover:bg-gray-200 rounded-full p-2 "
            onClick={() => router.back()}
          />
          <div
            className="grid grid-cols-1 lg:grid-cols-2 md:gap-10 shadow-lg
      rounded-2xl p-3 md:p-7 lg:p-12 xl:pd-16 "
          >
            <PinImage pinDetail={pinDetail} />
            <PinInfo pinDetail={pinDetail} />
          </div>
        </div>
      ) : null}
    </>
  );
}

export default PinDetail;
