"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import classNames from "classnames";
import Spinner from "../../components/commons/Spinner";
import PinImage from "../../components/pinDetail/PinImage";

function PinDetail({ params }: any) {
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
      <PinImage pinDetail={pinDetail} />
    </>
  );
}

export default PinDetail;
