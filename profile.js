const ADMIN_EMAIL = "2403717610421033@cit.edu.in";

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";

import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.10.0/firebase-auth.js";

import {
  getFirestore,
  collection,
  onSnapshot
} from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";


// ================= FIREBASE CONFIG =================

const firebaseConfig = {
  apiKey: "AIzaSyCe_RaEvI0SBq-5JC4RZS0W1ISUS0e4HO4",
  authDomain: "smart-campus-manager-4c7e4.firebaseapp.com",
  projectId: "smart-campus-manager-4c7e4",
  storageBucket: "smart-campus-manager-4c7e4.firebasestorage.app",
  messagingSenderId: "32992961921",
  appId: "1:32992961921:web:cd0ee909597178a9dff480"
};


// ================= INITIALIZE FIREBASE =================

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let currentUser;


// ================= AUTH CHECK =================

onAuthStateChanged(auth, (user) => {

  if (!user) {
    window.location.href = "index.html";
    return;
  }

  currentUser = user;

  // ===== BASIC USER INFO =====

  document.getElementById("userEmail").innerText = user.email;
  document.getElementById("emailDetail").innerText = user.email;

  document.getElementById("createdDate").innerText =
    new Date(user.metadata.creationTime).toDateString();


  // ===== ROLE DETECTION =====

  let role;

  if (user.email === ADMIN_EMAIL) {
    role = "Admin 👑";
  } else {
    role = "Student";
  }

  document.getElementById("userRole").innerText = role;
  document.getElementById("roleDetail").innerText = role;


  // ===== LOAD EVENTS =====

  loadEvents();

});


// ================= LOAD USER EVENTS =================

function loadEvents() {

  onSnapshot(collection(db, "events"), (snapshot) => {

    let myEvents = 0;
    let upcomingEvents = 0;

    const today = new Date().toISOString().split("T")[0];

    const eventList = document.getElementById("myEventsList");
    eventList.innerHTML = "";

    snapshot.forEach((docSnap) => {

      const event = docSnap.data();
      const participants = event.participants || [];

      // Check if user registered
      if (participants.includes(currentUser.email)) {

        myEvents++;

        if (event.date >= today) {
          upcomingEvents++;
        }

        const card = document.createElement("div");
        card.className = "eventCard";

        card.innerHTML = `
          <h3>${event.name}</h3>
          <p>Date: ${event.date}</p>
          <p>Status: Registered</p>
        `;

        eventList.appendChild(card);

      }

    });

    // ===== UPDATE STATISTICS =====

    document.getElementById("totalEvents").innerText = myEvents;
    document.getElementById("upcomingEvents").innerText = upcomingEvents;

  });

}


// ================= LOGOUT =================

window.logout = function () {

  signOut(auth).then(() => {
    window.location.href = "index.html";
  });

};