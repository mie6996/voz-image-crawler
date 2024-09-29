"use client";

import React, { ChangeEvent, useState } from "react";
import UploadImage from "./UploadImage";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import app from "../shared/firebaseConfig";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";

function Form() {
  const [title, setTitle] = useState();
  const [desc, setDesc] = useState();
  const [link, setLink] = useState();
  const [file, setFile] = useState<any>();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { data: session } = useSession();

  const storage = getStorage(app);
  const db = getFirestore(app);
  const postId = Date.now().toString();

  const onSave = () => {
    setLoading(true);
    uploadFile();
  };

  const uploadFile = async () => {
    try {
      const storageRef = ref(storage, "pinterest/" + file.name);
      await uploadBytes(storageRef, file);

      const url = await getDownloadURL(storageRef);
      const postData = {
        title,
        desc,
        link,
        image: url,
        userName: session?.user?.name,
        email: session?.user?.email,
        userImage: session?.user?.image,
        id: postId,
      };

      await setDoc(doc(db, "pinterest-post", postId), postData);

      setLoading(true);
      router.push("/" + session?.user?.email);
    } catch (err: any) {
      console.log("Hata", err);
    }
  };

  return (
    <div className="bg-white p-16 rounded-2xl">
      <div className="flex justify-end mb-6">
        <button
          onClick={() => onSave()}
          className="bg-red-500 p-2 text-white font-semibold px-3 rounded-lg"
        >
          {loading ? (
            <Image
              src="/loading-indicator.png"
              width={30}
              height={30}
              alt="loading"
              className="animate-spin"
            />
          ) : (
            <span>Save</span>
          )}
        </button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <UploadImage setFile={(file) => setFile(file)} />

        <div className="col-span-2">
          <div className="w-[100%]">
            <input
              onChange={(e: any) => setTitle(e.target.value)}
              type="text"
              placeholder="Add your title"
              className="text-[35px] outline-none font-bold w-full border-b-[2px] border-gray-400 placeholder-gray-400"
            />
            <h2 className="text-[12px] w-full text-gray-400">
              The first 40 Characters are what usually show up in feeds
            </h2>
            <textarea
              onChange={(e: any) => setDesc(e.target.value)}
              placeholder="Tell everyone what your pin is about"
              className="outline-none w-full mt-8 pb-4 text-[14px] border-b-[2px] border-gray-400 placeholder-gray-400"
            ></textarea>
            <input
              onChange={(e: any) => setLink(e.target.value)}
              type="text"
              placeholder="Add a Destination Link"
              className="outline-none w-full pb-4 mt-[90px] border-b-[2px] border-gray-400 placeholder-gray-400"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Form;
