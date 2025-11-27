import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  query,
  orderBy,
  where,
  doc,
  addDoc,
  setDoc,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDsohhSTCZmSXeD33DtHG2NE5rz7EwxjPo",
  authDomain: "apuwildescape-ce91d.firebaseapp.com",
  projectId: "apuwildescape-ce91d",
  storageBucket: "apuwildescape-ce91d.firebasestorage.app",
  messagingSenderId: "108602929920",
  appId: "1:108602929920:web:55303324ea9bc0c15cb9e5",
  measurementId: "G-X0DQ7N23Y5",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const usernameLists = {
  1: "kai.xuan.chen",
  2: "l.c.w._0213",
  3: "kjiajian_7",
};

export async function insertUsername() {
  try {
    for (const id in usernameLists) {
        const username = usernameLists[id];
    
        const userDocRef = doc(db, "users", `user${id}`);
        await setDoc(userDocRef, { username: username }, { merge: true });
    
        console.log(`Inserted username for user${id}: ${username}`);
    }
    alert("Insert Complete!");
  } catch (err) {
    console.error("Error: ", err);
  }
}
