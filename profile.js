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
  const chunksQuery = query(svgChunksCol, orderBy("part"));
  const snapshot = await getDocs(chunksQuery);

  if (!snapshot.empty) {
    const svgs = [];

    snapshot.forEach((doc) => {
      const data = doc.data();
      svgs[data.part] = data.chunk;
    });

    const fullSVG = svgs.join("");

    const container = document.getElementById("portfolio-container");
    const div = document.createElement("div");
    div.innerHTML = fullSVG;
    div.classList.add("svg-item");
    container.appendChild(div);

    setupSVGInteractions(div);
  } else {
    console.log("No SVG chunks found!");
  }
}

function setupSVGInteractions(svgItem) {
  console.log("SVG item loaded", svgItem);

  // Find the SVG element itself
  const svg = svgItem.querySelector('svg');
  console.log("SVG element:", svg);

  // Get all <g> elements inside the SVG
  const allGs = svg ? svg.querySelectorAll('g') : [];
  console.log("Total <g> elements found:", allGs.length);
  console.log("All <g> elements:", allGs);

  let lastClipG = null;
  let secondLastClipG = null;

  if (allGs.length >= 2) {
    // Get the last two <g> elements
    secondLastClipG = allGs[allGs.length - 2];
    lastClipG = allGs[allGs.length - 1];

    console.log("Second last <g>:", secondLastClipG);
    console.log("Last <g>:", lastClipG);

    // Add IDs for easier identification
    lastClipG.setAttribute('data-group', 'last');
    secondLastClipG.setAttribute('data-group', 'second-last');
    
    // Add visual indicators (optional - helps see clickable areas)
    lastClipG.style.cursor = 'pointer';
    secondLastClipG.style.cursor = 'pointer';
    
    // Optionally add hover effect to see the boundaries
    lastClipG.addEventListener('mouseenter', () => {
      console.log('🎯 Hovering over LAST <g>');
    });
    secondLastClipG.addEventListener('mouseenter', () => {
      console.log('🎯 Hovering over SECOND LAST <g>');
    });
  } else {
    console.log('Not enough <g> elements found.');
  }

  // Use event delegation on the parent container
  svgItem.addEventListener('click', (event) => {
    console.log('General SVG clicked:', event.target);
    
    // Check if the clicked element or any of its parents is our target
    let target = event.target;
    let path = [];
    
    while (target && target !== svgItem) {
      // Build path for debugging
      let identifier = target.tagName;
      if (target.getAttribute('data-group')) {
        identifier += `[data-group="${target.getAttribute('data-group')}"]`;
      }
      if (target.getAttribute('clip-path')) {
        identifier += `[clip-path="${target.getAttribute('clip-path')}"]`;
      }
      path.push(identifier);
      
      // Log comparison for debugging
      // console.log('Checking:', target);
      // console.log('Is lastClipG?', target === lastClipG);
      // console.log('Is secondLastClipG?', target === secondLastClipG);
      
      if (target === lastClipG) {
        alert("This is Last SVG!");
        console.log('✅ This is the LAST SVG clicked!');
        console.log('Click path:', path.join(' -> '));
        return;
      }
      if (target === secondLastClipG) {
        alert("This is Second Last SVG!");
        console.log('✅ This is the SECOND LAST SVG clicked!');
        console.log('Click path:', path.join(' -> '));
        return;
      }
      target = target.parentElement;
    }
    
    console.log('Clicked somewhere else in the SVG');
    console.log('Click path:', path.join(' -> '));
  });
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
