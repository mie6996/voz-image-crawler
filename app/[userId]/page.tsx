"use client";

import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import app from "../shared/firebaseConfig";
import UserInfo from "../components/UserInfo";
import PinList from "../components/pins/PinList";

interface ProfileParams {
  params: {
    userId: string;
  };
}

type User = {
  email: string;
  userImage: string;
  userName: string;
};

function Profile({ params }: ProfileParams) {
  const db = getFirestore(app);
  const [userInfo, setUserInfo] = useState<User>({
    email: "",
    userImage: "",
    userName: "",
  });
  const [listOfPins, setListOfPins] = useState<any>([]);

  useEffect(() => {
    const getUserInfo = async () => {
      const docRef = doc(db, "user", params.userId.replace("%40", "@"));
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setUserInfo(docSnap.data() as User);
      }
    };
    getUserInfo();
  }, [params, db]);

  useEffect(() => {
    const getUserPins = async () => {
      setListOfPins([]);

      const q = query(
        collection(db, "pinterest-post"),
        where("email", "==", userInfo.email)
      );

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setListOfPins((pins: any) => [...pins, doc.data()]);
      });
    };
    getUserPins();
  }, [db, userInfo.email]);

  return (
    <div>
      {userInfo ? <UserInfo userInfo={userInfo} /> : null}
      <PinList listOfPins={listOfPins} />
    </div>
  );
}

export default Profile;
