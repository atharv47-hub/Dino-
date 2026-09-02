import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, push, set } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

// Firebase configuration using your project database URL
const firebaseConfig = {
  apiKey: "AIzaSyCfQcKHDHzHFnCLS9rRUj4LYNgburyTCNY",
  authDomain: "starlord-4481e.firebaseapp.com",
  databaseURL: "https://starlord-4481e-default-rtdb.firebaseio.com",
  projectId: "starlord-4481e",
  storageBucket: "starlord-4481e.firebasestorage.app",
  messagingSenderId: "372842588023",
  appId: "1:372842588023:web:bdf6238ceba6823bf2e372"
};

// Initialize Firebase Realtime Database
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// DOM Elements
const form = document.getElementById("registrationForm");
const submitBtn = document.getElementById("submitBtn");
const formContainer = document.getElementById("formContainer");
const successContainer = document.getElementById("successContainer");

const confTeam = document.getElementById("confTeam");
const confUid = document.getElementById("confUid");
const confRegId = document.getElementById("confRegId");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  submitBtn.disabled = true;
  submitBtn.innerText = "Registering...";

  const registrationData = {
    teamName: document.getElementById("teamName").value.trim(),
    captainName: document.getElementById("captainName").value.trim(),
    captainUid: document.getElementById("captainUid").value.trim(),
    email: document.getElementById("email").value.trim(),
    phone: document.getElementById("phone").value.trim(),
    transactionId: document.getElementById("transactionId").value.trim(),
    registeredAt: new Date().toISOString()
  };

  try {
    const registrationsRef = ref(database, "registrations");
    const newEntryRef = push(registrationsRef);

    // Save registration to Firebase
    await set(newEntryRef, registrationData);

    // Set values for the success card
    confTeam.innerText = registrationData.teamName;
    confUid.innerText = registrationData.captainUid;
    confRegId.innerText = newEntryRef.key;

    // Switch screen to success
    formContainer.classList.add("hidden");
    formContainer.style.display = "none";

    successContainer.classList.remove("hidden");
    successContainer.style.display = "block";

  } catch (error) {
    console.error("Submission failed:", error);
    alert("Error saving registration: " + error.message);
    submitBtn.disabled = false;
    submitBtn.innerText = "Register Squad";
  }
});