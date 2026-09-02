import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, push, set } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyCfQcKHDHzHFnCLS9rRUj4LYNgburyTCNY",
  authDomain: "starlord-4481e.firebaseapp.com",
  databaseURL: "https://starlord-4481e-default-rtdb.firebaseio.com",
  projectId: "starlord-4481e",
  messagingSenderId: "372842588023",
  appId: "1:372842588023:web:bdf6238ceba6823bf2e372"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const form = document.getElementById("registrationForm");
const submitBtn = document.getElementById("submitBtn");
const formContainer = document.getElementById("formContainer");
const successContainer = document.getElementById("successContainer");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  submitBtn.disabled = true;
  submitBtn.innerText = "Submitting details...";

  try {
    const teamNameInput = document.getElementById("teamName");
    const captainNameInput = document.getElementById("captainName");
    const captainUidInput = document.getElementById("captainUid");
    const emailInput = document.getElementById("email");
    const phoneInput = document.getElementById("phone");
    const txInput = document.getElementById("transactionId");
    const fileInput = document.getElementById("paymentScreenshot");

    const registrationData = {
      teamName: teamNameInput ? teamNameInput.value.trim() : "N/A",
      captainName: captainNameInput ? captainNameInput.value.trim() : "N/A",
      captainUid: captainUidInput ? captainUidInput.value.trim() : "N/A",
      email: emailInput ? emailInput.value.trim() : "N/A",
      phone: phoneInput ? phoneInput.value.trim() : "N/A",
      transactionId: txInput ? txInput.value.trim() : "N/A",
      screenshotFileName: fileInput && fileInput.files[0] ? fileInput.files[0].name : "No file selected",
      registeredAt: new Date().toISOString()
    };

    // Save directly to Firebase Realtime Database
    const registrationsRef = ref(database, "registrations");
    const newEntryRef = push(registrationsRef);
    await set(newEntryRef, registrationData);

    // Update receipt cards
    const confTeam = document.getElementById("confTeam");
    const confUid = document.getElementById("confUid");
    const confRegId = document.getElementById("confRegId");

    if (confTeam) confTeam.innerText = registrationData.teamName;
    if (confUid) confUid.innerText = registrationData.captainUid;
    if (confRegId) confRegId.innerText = newEntryRef.key;

    // Switch screens
    if (formContainer) {
      formContainer.style.setProperty("display", "none", "important");
    }
    if (successContainer) {
      successContainer.style.setProperty("display", "block", "important");
      successContainer.classList.remove("hidden");
    }

  } catch (error) {
    console.error("Submission error:", error);
    alert("Error saving: " + error.message);
    submitBtn.disabled = false;
    submitBtn.innerText = "Register Squad";
  }
});
