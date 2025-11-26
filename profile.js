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

const userDocRef = doc(db, "users", "user1"); // reference to user1 document
const svgChunksCol = collection(userDocRef, "svg_chunks"); // svg_chunks subcollection

async function loadSVG() {
  // Query the chunks ordered by part
  const chunksQuery = query(svgChunksCol, orderBy("part"));
  const snapshot = await getDocs(chunksQuery);

  if (!snapshot.empty) {
    const svgs = [];

    snapshot.forEach((doc) => {
      const data = doc.data();
      svgs[data.part] = data.chunk; // Store in order of part
    });

    // Combine all chunks into the full SVG
    const fullSVG = svgs.join("");

    const container = document.getElementById("portfolio-container");
    const div = document.createElement("div");
    div.innerHTML = fullSVG;
    div.classList.add("svg-item");
    container.appendChild(div);
  } else {
    console.log("No SVG chunks found!");
  }
}

loadSVG();

/*
// Reference to the document
const docRef = doc(db, "users", "user1");

// Set data
await setDoc(docRef, {
  name: "John Doe",
  age: 30,
  email: "john@example.com"
});

await setDoc(docRef, { age: 31 }, { merge: true });

const docSnap = await getDoc(docRef);

if (docSnap.exists()) {
  console.log("Document data:", docSnap.data());
} else {
  console.log("No such document!");
}

// Listen for realtime updates
onSnapshot(docRef, (docSnap) => {
  if (docSnap.exists()) {
    console.log("Realtime data:", docSnap.data());
  } else {
    console.log("Document deleted or doesn't exist");
  }
});

import { updateDoc } from "firebase/firestore";

await updateDoc(docRef, {
  age: 32
});


import { deleteDoc } from "firebase/firestore";

await deleteDoc(docRef);


*/
