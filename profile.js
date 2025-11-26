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

const userDocRef = doc(db, "users", "user1");
const svgChunksCol = collection(userDocRef, "svg_chunks");

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

  // Find the SVG element
  const svg = svgItem.querySelector('svg');
  console.log("SVG element:", svg);

  // Navigate: svg -> g[clip-path] -> g[transform] -> g[clip-path]
  const firstClipPathG = svg ? svg.querySelector('g[clip-path]') : null;
  console.log("First g[clip-path]:", firstClipPathG);

  const transformG = firstClipPathG ? firstClipPathG.querySelector('g[transform]') : null;
  console.log("g[transform]:", transformG);

  const secondClipPathG = transformG ? transformG.querySelector('g[clip-path]') : null;
  console.log("Second g[clip-path] (parent of target groups):", secondClipPathG);

  let lastClipG = null;
  let secondLastClipG = null;

  if (secondClipPathG) {
    // Get direct children <g> elements only
    const childGs = Array.from(secondClipPathG.children).filter(child => child.tagName === 'g');
    console.log("Direct child <g> elements:", childGs.length);
    console.log("All child <g> elements:", childGs);

    if (childGs.length >= 2) {
      secondLastClipG = childGs[childGs.length - 2];
      lastClipG = childGs[childGs.length - 1];

      console.log("Second last <g>:", secondLastClipG);
      console.log("Last <g>:", lastClipG);

      // Add IDs for easier identification
      lastClipG.setAttribute('data-group', 'last');
      secondLastClipG.setAttribute('data-group', 'second-last');
      
      // Add visual indicators
      lastClipG.style.cursor = 'pointer';
      secondLastClipG.style.cursor = 'pointer';
      
      // Hover effects
      lastClipG.addEventListener('mouseenter', () => {
        console.log('🎯 Hovering over LAST <g>');
      });
      secondLastClipG.addEventListener('mouseenter', () => {
        console.log('🎯 Hovering over SECOND LAST <g>');
      });
    } else {
      console.log('Not enough child <g> elements found.');
    }
  } else {
    console.log('Could not find the target parent <g> element.');
  }

  // Use event delegation on the parent container
  svgItem.addEventListener('click', (event) => {
    // Check if the clicked element or any of its parents is our target
    let target = event.target;
    let foundLast = false;
    let foundSecondLast = false;
    
    while (target && target !== svgItem) {
      if (target === lastClipG) {
        foundLast = true;
      }
      if (target === secondLastClipG) {
        foundSecondLast = true;
      }
      target = target.parentElement;
    }
    
    // Check in priority order: last takes precedence over second-last
    if (foundLast) {
      alert("This is last!");
      console.log('✅ This is the LAST SVG clicked!');
    } else if (foundSecondLast) {
      alert("This is second last!");
      console.log('✅ This is the SECOND LAST SVG clicked!');
    } else {
      console.log('Clicked somewhere else in the SVG');
    }
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
