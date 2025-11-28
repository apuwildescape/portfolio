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
    1: "ycheng_1221___",
    2: "c21mva31",
    3: "apuclcs_apuwildescape25",
    4: "Alyna_0528",
    5: "kaienyhip._",
    6: "kj.w0ng",
    7: "chan.j.w",
    8: "apuclcs_apuwildescape25", // appears twice in your list
    9: "wendy_lim_5560",
    10: "erictou0214",
    11: "chenxuqnyu",
    12: "xy1711",
    13: "jennifer_24jen",
    14: "kaishen0123",
    15: "enyee__3",
    16: "lijingwei2727",
    17: "suang.l",
    18: "Cfm_041029",
    19: "iris.y___",
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
