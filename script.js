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
  submitBtn.innerText = "Registering...";

  // Grab the selected file name if a user picked one (no upload needed)
  const fileInput = document.getElementById("paymentScreenshot");
  const fileName = fileInput && fileInput.files[0] ? fileInput.files[0].name : "None";

  const registrationData = {
    teamName: document.getElementById("teamName").value.trim(),
    captainName: document.getElementById("captainName").value.trim(),
    captainUid: document.getElementById("captainUid").value.trim(),
    email: document.getElementById("email").value.trim(),
    phone: document.getElementById("phone").value.trim(),
    transactionId: document.getElementById("transactionId").value.trim(),
    screenshotFileName: fileName,
    registeredAt: new Date().toISOString()
  };

  try {
    const registrationsRef = ref(database, "registrations");
    const newEntryRef = push(registrationsRef);

    // Save directly to Realtime Database
    await set(newEntryRef, registrationData);

    // Populate receipt
    document.getElementById("confTeam").innerText = registrationData.teamName;
    document.getElementById("confUid").innerText = registrationData.captainUid;
    document.getElementById("confRegId").innerText = newEntryRef.key;

    // Switch view immediately to Thank You page
    formContainer.setAttribute("style", "display: none !important");
    successContainer.setAttribute("style", "display: block !important");
  } catch (error) {
    console.error("Submission failed:", error);
    alert("Submission Error: " + error.message);
    submitBtn.disabled = false;
    submitBtn.innerText = "Register Squad";
  }
});
