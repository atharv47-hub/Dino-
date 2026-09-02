import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, push, set } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";
import { getStorage, ref as sRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyCfQcKHDHzHFnCLS9rRUj4LYNgburyTCNY",
  authDomain: "starlord-4481e.firebaseapp.com",
  databaseURL: "https://starlord-4481e-default-rtdb.firebaseio.com",
  projectId: "starlord-4481e",
  storageBucket: "starlord-4481e.firebasestorage.app",
  messagingSenderId: "372842588023",
  appId: "1:372842588023:web:bdf6238ceba6823bf2e372"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const storage = getStorage(app);

const form = document.getElementById("registrationForm");
const submitBtn = document.getElementById("submitBtn");
const formContainer = document.getElementById("formContainer");
const successContainer = document.getElementById("successContainer");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  submitBtn.disabled = true;
  submitBtn.innerText = "Processing...";

  try {
    let screenshotUrl = "None";
    const fileInput = document.getElementById("paymentScreenshot");

    // Upload only if the element exists and a file is selected
    if (fileInput && fileInput.files && fileInput.files[0]) {
      try {
        submitBtn.innerText = "Uploading Image...";
        const file = fileInput.files[0];
        const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        const imageRef = sRef(storage, `payments/${Date.now()}_${cleanName}`);
        await uploadBytes(imageRef, file);
        screenshotUrl = await getDownloadURL(imageRef);
      } catch (storageErr) {
        console.warn("Storage upload failed, continuing with registration:", storageErr);
      }
    }

    submitBtn.innerText = "Saving Details...";

    const registrationData = {
      teamName: document.getElementById("teamName")?.value.trim() || "",
      captainName: document.getElementById("captainName")?.value.trim() || "",
      captainUid: document.getElementById("captainUid")?.value.trim() || "",
      email: document.getElementById("email")?.value.trim() || "",
      phone: document.getElementById("phone")?.value.trim() || "",
      transactionId: document.getElementById("transactionId")?.value.trim() || "",
      paymentScreenshotUrl: screenshotUrl,
      registeredAt: new Date().toISOString()
    };

    const newEntryRef = push(ref(database, "registrations"));
    await set(newEntryRef, registrationData);

    // Update screen data safely
    const elTeam = document.getElementById("confTeam");
    const elUid = document.getElementById("confUid");
    const elReg = document.getElementById("confRegId");

    if (elTeam) elTeam.innerText = registrationData.teamName;
    if (elUid) elUid.innerText = registrationData.captainUid;
    if (elReg) elReg.innerText = newEntryRef.key;

    // Direct DOM switch
    formContainer.setAttribute("style", "display: none !important");
    successContainer.setAttribute("style", "display: block !important");

  } catch (error) {
    console.error("Critical registration failure:", error);
    alert("Error: " + error.message);
    submitBtn.disabled = false;
    submitBtn.innerText = "Register Squad";
  }
});
