import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  query,
  orderBy,
  getDocs,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDsohhSTCZmSXeD33DtHG2NE5rz7EwxjPo",
  authDomain: "apuwildescape-ce91d.firebaseapp.com",
  projectId: "apuwildescape-ce91d",
  storageBucket: "apuwildescape-ce91d.firebasestorage.app",
  messagingSenderId: "108602929920",
  appId: "1:108602929920:web:55303324ea9bc0c15cb9e5",
  measurementId: "G-X0DQ7N23Y5",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Function to extract the user ID from the URL
function getUserIdFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get("id"); // Returns the value of the "id" query parameter
}

// Function to load the SVG based on the user ID
async function loadSVG(userID) {
  const userDocRef = doc(db, "users", `user${userID}`);
  const svgChunksCol = collection(userDocRef, "svg_chunks");

  const chunksQuery = query(svgChunksCol, orderBy("part"));
  const snapshot = await getDocs(chunksQuery);

  if (!snapshot.empty) {
    const svgs = [];

    snapshot.forEach((doc) => {
      const data = doc.data();
      svgs[data.part] = data.chunk; // Store each chunk in the correct order
    });

    const fullSVG = svgs.join(""); // Combine all chunks into one complete SVG

    // Append the full SVG to the portfolio container
    const container = document.getElementById("portfolio-container");
    const div = document.createElement("div");
    div.innerHTML = fullSVG;
    div.classList.add("svg-item");
    container.appendChild(div);

    // Optionally, call the function to set up interactions with the SVG elements (hover/click effects)
    await setupSVGInteractions(div); // Use async/await here for setup function
  } else {
    console.log("No SVG chunks found!");
    alert("No SVG chunks found for this user.");
  }
}

// Function to set up interactions with the SVG (e.g., hover, click)
async function setupSVGInteractions(svgItem) {
  console.log("SVG item loaded", svgItem);

  // Find the SVG element
  const svg = svgItem.querySelector("svg");
  console.log("SVG element:", svg);

  // Navigate through SVG structure to find specific elements to interact with
  const firstClipPathG = svg ? svg.querySelector("g[clip-path]") : null;
  console.log("First g[clip-path]:", firstClipPathG);

  const transformG = firstClipPathG
    ? firstClipPathG.querySelector("g[transform]")
    : null;
  console.log("g[transform]:", transformG);

  let secondClipPathG = transformG
    ? transformG.querySelector("g[clip-path]")
    : null;
  console.log("Second g[clip-path] (parent of target groups):", secondClipPathG);

//   secondClipPathG = document.querySelector(".svg-item svg g[clip-path] g[transform] g[clip-path]");
secondClipPathG = document.querySelector(".svg-item svg");

  let lastClipG = null;
  let secondLastClipG = null;

  if (secondClipPathG) {
    // Get direct child <g> elements only
    const childGs = Array.from(secondClipPathG.children).filter(
      (child) => child.tagName === "g"
    );
    console.log("Direct child <g> elements:", childGs.length);

    if (childGs.length >= 2) {
      secondLastClipG = childGs[childGs.length - 2];
      lastClipG = childGs[childGs.length - 1];

      console.log("Second last <g>:", secondLastClipG);
      console.log("Last <g>:", lastClipG);

      // Add IDs for easier identification
      lastClipG.setAttribute("data-group", "last");
      secondLastClipG.setAttribute("data-group", "second-last");

      // Add visual indicators
      lastClipG.style.cursor = "pointer";
      secondLastClipG.style.cursor = "pointer";

      // Hover effects
      lastClipG.addEventListener("mouseenter", () => {
        console.log("🎯 Hovering over LAST <g>");
      });
      secondLastClipG.addEventListener("mouseenter", () => {
        console.log("🎯 Hovering over SECOND LAST <g>");
      });
    } else {
      console.log("Not enough child <g> elements found.");
    }
  } else {
    console.log("Could not find the target parent <g> element.");
  }

  // Use event delegation on the parent container for click events
  svgItem.addEventListener("click", async (event) => {
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

    const userId = getUserIdFromUrl();
    const userDocRef = doc(db, "users", `user${userId}`);
    const userSnap = await getDoc(userDocRef);
    let userIG = "";

    if (userSnap.exists()) {
        userIG = userSnap.data().username;
    }

    // Check in priority order: last takes precedence over second-last
    if (foundLast) {
      // alert("This is last!");
      console.log("✅ This is the LAST SVG clicked!");
      const username = `${userIG}`;
      const instagramWebUrl = `https://www.instagram.com/${username}/`; // Web URL for fallback
      const instagramAppUrl = `instagram://user?username=${username}`; // Deep link for Instagram app

      // Check if the user is on a mobile device (iOS or Android)
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

      // Check if the user is on a desktop (not a mobile device)
      const isDesktop = !isMobile;

      if (isDesktop) {
        // On Desktop (Chrome, Safari, etc.), open the Instagram profile in a new tab
        window.open(instagramWebUrl, "_blank");
        return;
      }

      // For mobile devices (iOS or Android)
      if (isMobile) {
        const iframe = document.createElement("iframe");
        iframe.style.display = "none";
        iframe.src = instagramAppUrl;

        // Append iframe to try to trigger the deep link (for Instagram app)
        document.body.appendChild(iframe);

        // Timeout to detect if Instagram app opens, fallback to web URL in a new tab
        setTimeout(function () {
          document.body.removeChild(iframe); // Remove iframe after timeout

          // If the app didn't open, fallback to the web URL
          window.location.href = instagramWebUrl;
        }, 1500);
      }
    } else if (foundSecondLast) {
    //   alert("This is second last!");
    location.href="https://heyzine.com/flip-book/67223f0f89.html"
      console.log("✅ This is the SECOND LAST SVG clicked!");
    } else {
      console.log("Clicked somewhere else in the SVG");
    }
  });
}

// Main function to initialize the loading of user data and SVG
async function init() {
  const userID = getUserIdFromUrl(); // Get the user ID from the URL
  if (userID) {
    await loadSVG(userID); // Load SVG for that user
  } else {
    alert("User ID is missing in the URL.");
    location.href="./index.html";
  }
}

// Call the init function to start the process
init();
