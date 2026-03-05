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
  onSnapshot,
  updateDoc,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.10.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCe_RaEvI0SBq-5JC4RZS0W1ISUS0e4HO4",
  authDomain: "smart-campus-manager-4c7e4.firebaseapp.com",
  projectId: "smart-campus-manager-4c7e4",
  storageBucket: "smart-campus-manager-4c7e4.firebasestorage.app",
  messagingSenderId: "32992961921",
  appId: "1:32992961921:web:cd0ee909597178a9dff480"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

let currentUser;
let chartInstance = null;



// ================= AUTH CHECK =================

onAuthStateChanged(auth, (user) => {

  if (!user) {
    window.location.href = "index.html";
    return;
  }

  currentUser = user;

  document.getElementById("welcome").innerText =
  "Welcome " + user.email;

  if(user.email === ADMIN_EMAIL){
    document.getElementById("adminPanel").style.display = "block";
  }

  loadEvents();

});



// ================= LOAD EVENTS =================

function loadEvents() {

  onSnapshot(collection(db, "events"), (snapshot) => {

    const eventList = document.getElementById("eventList");
    const registeredEvents = document.getElementById("registeredEvents");

    eventList.innerHTML = "";
    registeredEvents.innerHTML = "";

    let labels = [];
    let data = [];

    let totalEvents = 0;
    let totalRegistrations = 0;
    let myEvents = 0;

    const today = new Date().toISOString().split("T")[0];
    let todayEvents = 0;

    snapshot.forEach((docSnap) => {

      const event = docSnap.data();
      const id = docSnap.id;

      const participants = event.participants || [];

      totalEvents++;
      totalRegistrations += participants.length;

      if (event.date === today) {
        todayEvents++;
      }

      labels.push(event.name);
      data.push(participants.length);

      // ========== EVENT CARD ==========

      const card = document.createElement("div");
      card.className = "eventCard";

      card.innerHTML = `
        <h3>${event.name}</h3>
        <p>Date: ${event.date}</p>
        <p>Participants: ${participants.length}/100</p>
        <button onclick="registerEvent('${id}')">Register</button>
      `;

      eventList.appendChild(card);


      // ========== USER REGISTERED EVENTS ==========

      if (participants.includes(currentUser.email)) {

        myEvents++;

        const card2 = document.createElement("div");
        card2.className = "eventCard";

        card2.innerHTML = `
          <h3>${event.name}</h3>
          <p>Date: ${event.date}</p>
        `;

        registeredEvents.appendChild(card2);
      }

    });


    // ===== UPDATE ANALYTICS =====

    document.getElementById("totalEvents").innerText = totalEvents;
    document.getElementById("totalRegistrations").innerText = totalRegistrations;
    document.getElementById("myEvents").innerText = myEvents;
    document.getElementById("todayEvents").innerText = todayEvents;


    // ===== RENDER GRAPH =====

    renderChart(labels, data);

  });

}



// ================= REGISTER EVENT =================

window.registerEvent = async function (id) {

  const ref = doc(db, "events", id);

  const snapshot = await getDoc(ref);

  const event = snapshot.data();

  const participants = event.participants || [];

  if (participants.includes(currentUser.email)) {
    alert("You are already registered.");
    return;
  }

  if (participants.length >= 100) {
    alert("Event is full.");
    return;
  }

  await updateDoc(ref, {
    participants: [...participants, currentUser.email]
  });

};



// ================= CHART =================

function renderChart(labels, data) {

  const ctx = document.getElementById("eventChart").getContext("2d");

  if (chartInstance) {
    chartInstance.destroy();
  }

  chartInstance = new Chart(ctx, {

    type: "bar",

    data: {
      labels: labels,
      datasets: [
        {
          label: "Participants",
          data: data,
          backgroundColor: "#ff6b00"
        }
      ]
    },

    options: {

      responsive: true,

      scales: {
        y: {
          beginAtZero: true,
          min: 0,
          max: 100,
          ticks: {
            stepSize: 10
          }
        }
      }

    }

  });

}



// ================= LOGOUT =================

window.logout = function () {

  signOut(auth).then(() => {
    window.location.href = "index.html";
  });

};