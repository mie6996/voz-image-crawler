// create a new file in the app/api directory called voz.ts

import { getFirestore, collection, getDocs } from "firebase/firestore";
import app from "../shared/firebaseConfig";

const db = getFirestore(app);
