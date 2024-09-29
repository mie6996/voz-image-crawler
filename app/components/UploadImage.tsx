"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import React, { useState } from "react";
import { HiArrowUpCircle } from "react-icons/hi2";

interface Props {
  setFile: React.Dispatch<React.SetStateAction<undefined>>;
}

function UploadImage({ setFile }: Props) {
  const { data: session } = useSession();
  const [selectedFile, setSelectedFile] = useState();

  return (
    <div className="h-[450px] bg-[#e9e9e9] rounded-lg">
      <label className="m-5 flex flex-col justify-center items-center cursor-pointer h-[90%] border-[2px] border-gray-300 border-dashed rounded-lg text-gray-600">
        {!selectedFile ? (
          <div className="flex items-center flex-col">
            <HiArrowUpCircle className="text-[22px]" />
            <h2 className="font-semibold">Click to upload</h2>
          </div>
        ) : null}

        {selectedFile ? (
          <Image
            src={window.URL.createObjectURL(selectedFile)}
            alt="selected image"
            width={500}
            height={800}
            className="object-contain h-[90%]"
          />
        ) : null}

        <input
          type="file"
          id="dropzone-file"
          className="hidden"
          onChange={(e: any) => {
            setFile(e.target.files[0]);
            setSelectedFile(e.target.files[0]);
          }}
        />
      </label>
    </div>
  );
}

export default UploadImage;
