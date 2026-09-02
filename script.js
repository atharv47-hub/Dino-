// Firebase SDK Modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, push, set } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";
import { getStorage, ref as sRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyCfQcKHDHzHFnCLS9rRUj4LYNgburyTCNY",
  authDomain: "starlord-4481e.firebaseapp.com",
  databaseURL: "https://starlord-4481e-default-rtdb.firebaseio.com",
  projectId: "starlord-4481e",
  storageBucket: "starlord-4481e.firebasestorage.app",
  messagingSenderId: "372842588023",
  appId: "1:372842588023:web:bdf6238ceba6823bf2e372"
};

// Initialize Firebase Services
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const storage = getStorage(app);

// DOM Elements
const form = document.getElementById("registrationForm");
const submitBtn = document.getElementById("submitBtn");
const formContainer = document.getElementById("formContainer");
const successContainer = document.getElementById("successContainer");

const confTeam = document.getElementById("confTeam");
const confUid = document.getElementById("confUid");
const confRegId = document.getElementById("confRegId");

// Handle Form Submission
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  submitBtn.disabled = true;
  submitBtn.innerText = "Uploading & Registering...";

  try {
    const fileInput = document.getElementById("paymentScreenshot");
    const file = fileInput.files[0];
    let screenshotUrl = "";

    // 1. Upload Screenshot to Firebase Storage if selected
    if (file) {
      const cleanFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const storagePath = `payments/${Date.now()}_${cleanFileName}`;
      const imageRef = sRef(storage, storagePath);

      await uploadBytes(imageRef, file);
      screenshotUrl = await getDownloadURL(imageRef);
    }

    // 2. Prepare payload for Realtime Database
    const registrationData = {
      teamName: document.getElementById("teamName").value.trim(),
      captainName: document.getElementById("captainName").value.trim(),
      captainUid: document.getElementById("captainUid").value.trim(),
      email: document.getElementById("email").value.trim(),
      phone: document.getElementById("phone").value.trim(),
      transactionId: document.getElementById("transactionId").value.trim(),
      paymentScreenshotUrl: screenshotUrl,
      registeredAt: new Date().toISOString()
    };

    // 3. Push to Firebase Realtime Database
    const registrationsRef = ref(database, "registrations");
    const newEntryRef = push(registrationsRef);
    await set(newEntryRef, registrationData);

    // 4. Update and display Success Screen
    confTeam.innerText = registrationData.teamName;
    confUid.innerText = registrationData.captainUid;
    confRegId.innerText = newEntryRef.key;

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
