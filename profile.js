// Import Firebase modules (v9 CDN)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Your config
const firebaseConfig = {
  apiKey: "AIzaSyDsohhSTCZmSXeD33DtHG2NE5rz7EwxjPo",
  authDomain: "apuwildescape-ce91d.firebaseapp.com",
  projectId: "apuwildescape-ce91d",
  storageBucket: "apuwildescape-ce91d.firebasestorage.app",
  messagingSenderId: "108602929920",
  appId: "1:108602929920:web:55303324ea9bc0c15cb9e5",
  measurementId: "G-X0DQ7N23Y5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Save data to Firestore
async function saveTest() {
  await setDoc(doc(db, "test", "test1"), {
    status: "hi"
  });

  console.log("Document written!");
}

saveTest();
