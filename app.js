import { initializeApp } from "https://www.gstatic.com/firebasejs/12.10.0/firebase-app.js";

import {
getAuth,
createUserWithEmailAndPassword,
signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.10.0/firebase-auth.js";

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

window.register = async function(){

const email=document.getElementById("email").value;
const password=document.getElementById("password").value;

await createUserWithEmailAndPassword(auth,email,password);

alert("Registered successfully");

};

window.login = async function(){

const email=document.getElementById("email").value;
const password=document.getElementById("password").value;

await signInWithEmailAndPassword(auth,email,password);

window.location.href="dashboard.html";

};