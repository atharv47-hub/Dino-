// ============================================
// FIREBASE IMPORTS
// ============================================

import {
    initializeApp
}
from "https://www.gstatic.com/firebasejs/12.1.0/firebase-app.js";


import {
    getFirestore,
    collection,
    addDoc,
    serverTimestamp
    
}
from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

import {
  getDatabase,
  ref,
  push,
  set
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";



// ============================================
// FIREBASE CONFIG
// ============================================

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCfQcKHDHzHFnCLS9rRUj4LYNgburyTCNY",
  authDomain: "thanos-d2084.firebaseapp.com",
    databaseURL:"https://thanos-d2084-default-rtdb.firebaseio.com",
  projectId: "thanos-d2084",
  storageBucket: "thanos-d2084.firebasestorage.app",
  messagingSenderId: "372842588023",
  appId: "1:372842588023:web:bdf6238ceba6823bf2e372",
  measurementId: "G-WN03HQ794S"
};


// Initialize Firebase

const app =
    initializeApp(firebaseConfig);


const db =
    getDatabase(app);


const storage =
    getStorage(app);



// ============================================
// ELEMENTS
// ============================================

const form = document.getElementById("registrationForm");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    try {
        await addDoc(collection(db, "registrations"), {
            teamName: document.getElementById("teamName").value,
            captainName: document.getElementById("captainName").value,
            phone: document.getElementById("phone").value,
            registeredAt: new Date().toISOString()
        });

        alert("Registration successful!");

        form.reset();

    } catch (error) {
        console.error(error);
        alert("Registration failed!");
    }
});



// ============================================
// SHOW CAPTAIN NAME AUTOMATICALLY
// ============================================

captainName.addEventListener(
    "input",
    function() {

        player1Display.value =
            captainName.value;

    }
);



// ============================================
// FORM SUBMIT
// ============================================

form.addEventListener(
    "submit",
    async function(event) {

        event.preventDefault();


        // ----------------------------------------
        // GET DATA
        // ----------------------------------------

        const teamName =
            document.getElementById(
                "teamName"
            ).value.trim();


        const captain =
            captainName.value.trim();


        const mobile =
            document.getElementById(
                "mobile"
            ).value.trim();


        const captainUID =
            document.getElementById(
                "captainUID"
            ).value.trim();


        const player2 =
            document.getElementById(
                "player2"
            ).value.trim();


        const uid2 =
            document.getElementById(
                "uid2"
            ).value.trim();


        const player3 =
            document.getElementById(
                "player3"
            ).value.trim();


        const uid3 =
            document.getElementById(
                "uid3"
            ).value.trim();


        const player4 =
            document.getElementById(
                "player4"
            ).value.trim();


        const uid4 =
            document.getElementById(
                "uid4"
            ).value.trim();


        const transactionId =
            document.getElementById(
                "transactionId"
            ).value.trim();


        const screenshot =
            document.getElementById(
                "paymentScreenshot"
            ).files[0];



        // ========================================
        // VALIDATION
        // ========================================

        if (
            !/^[0-9]{10}$/.test(mobile)
        ) {

            alert(
                "Please enter a valid 10 digit mobile number."
            );

            return;

        }


        if (!screenshot) {

            alert(
                "Please upload your payment screenshot."
            );

            return;

        }


        // 5MB LIMIT

        if (
            screenshot.size >
            5 * 1024 * 1024
        ) {

            alert(
                "Screenshot must be less than 5MB."
            );

            return;

        }



        try {

            submitBtn.disabled =
                true;


            submitBtn.innerHTML =
                "⏳ SUBMITTING...";



            // ====================================
            // REGISTRATION ID
            // ====================================

            const randomNumber =
                Math.floor(
                    10000 +
                    Math.random() * 90000
                );


            const regID =
                "FF2026-" +
                randomNumber;



            // ====================================
            // UPLOAD SCREENSHOT
            // ====================================

            const fileName =
                Date.now() +
                "_" +
                screenshot.name;


            const storageReference =
                ref(
                    storage,
                    "payment-screenshots/" +
                    fileName
                );


            await uploadBytes(
                storageReference,
                screenshot
            );


            const screenshotURL =
                await getDownloadURL(
                    storageReference
                );



            // ====================================
            // FIRESTORE DATA
            // ====================================

            const registrationData = {

                registrationId:
                    regID,

                teamName:
                    teamName,

                captain: {

                    name:
                        captain,

                    mobile:
                        mobile,

                    uid:
                        captainUID

                },


                players: [

                    {
                        playerNumber: 1,

                        name:
                            captain,

                        uid:
                            captainUID

                    },

                    {
                        playerNumber: 2,

                        name:
                            player2,

                        uid:
                            uid2

                    },

                    {
                        playerNumber: 3,

                        name:
                            player3,

                        uid:
                            uid3

                    },

                    {
                        playerNumber: 4,

                        name:
                            player4,

                        uid:
                            uid4

                    }

                ],


                payment: {

                    amount:
                        50,

                    transactionId:
                        transactionId,

                    screenshotURL:
                        screenshotURL

                },


                status:
                    "Pending",


                tournament:
                    "Free Fire Championship 2026",


                createdAt:
                    serverTimestamp()

            };



            // ====================================
            // SAVE TO FIRESTORE
            // ====================================

          const registrationRef = push(ref(database, "registrations"));

await set(registrationRef, {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value,
    createdAt: new Date().toISOString()
});


            // ====================================
            // SUCCESS SCREEN
            // ====================================

            form.style.display =
                "none";


            successMessage.style.display =
                "block";


            registrationId.innerText =
                regID;


            window.scrollTo({

                top:
                    successMessage.offsetTop - 100,

                behavior:
                    "smooth"

            });



        } catch (error) {

            console.error(
                "Firebase Error:",
                error
            );


            alert(
                "Registration failed. Please check your Firebase configuration."
            );

        }


        submitBtn.disabled =
            false;


        submitBtn.innerHTML =
            "<span>🔥</span> CONFIRM REGISTRATION <span>→</span>";

    }
);
