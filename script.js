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
    getStorage,
    ref,
    uploadBytes,
    getDownloadURL
}
from "https://www.gstatic.com/firebasejs/12.1.0/firebase-storage.js";



// ============================================
// FIREBASE CONFIG
// ============================================

const firebaseConfig = {

    apiKey: "YOUR_API_KEY",

    authDomain:
        "YOUR_PROJECT.firebaseapp.com",

    projectId:
        "YOUR_PROJECT_ID",

    storageBucket:
        "YOUR_PROJECT.firebasestorage.app",

    messagingSenderId:
        "YOUR_MESSAGING_SENDER_ID",

    appId:
        "YOUR_APP_ID"

};


// Initialize Firebase

const app =
    initializeApp(firebaseConfig);


const db =
    getFirestore(app);


const storage =
    getStorage(app);



// ============================================
// ELEMENTS
// ============================================

const form =
    document.getElementById(
        "registrationForm"
    );


const submitBtn =
    document.getElementById(
        "submitBtn"
    );


const successMessage =
    document.getElementById(
        "successMessage"
    );


const registrationId =
    document.getElementById(
        "registrationId"
    );


const captainName =
    document.getElementById(
        "captainName"
    );


const player1Display =
    document.getElementById(
        "player1Display"
    );



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

            await addDoc(

                collection(
                    db,
                    "tournamentRegistrations"
                ),

                registrationData

            );



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
