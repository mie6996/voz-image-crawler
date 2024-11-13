"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import classNames from "classnames";
import { useRouter } from "next/navigation";
import Spinner from "../../components/commons/Spinner";
import PinImage from "../../components/pinDetail/PinImage";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

function PinDetail({ params }: any) {
  const router = useRouter();

  const getPinDetail = async () => {
    const data = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/images/${params.pinId}`
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
      <div className="flex items-center justify-center gap-x-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ChevronLeft />
        </Button>
        <PinImage pinDetail={pinDetail} />
      </div>
    </>
  );
}

export default PinDetail;
