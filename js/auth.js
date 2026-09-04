import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// Configurasaun Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAypSFktnxRFXlR0P3EnBMf7p1DEwdSHb8",
    authDomain: "fish-feeder-db.firebaseapp.com",
    databaseURL: "https://fish-feeder-db-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "fish-feeder-db",
    storageBucket: "fish-feeder-db.firebasestorage.app",
    messagingSenderId: "498255146529",
    appId: "1:498255146529:web:cabcdaf269e970c941bd60",
    measurementId: "G-2YQVEHL7HK"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// 1. Verifika Sesaun: Se login tiha ona, haruka diretu ba index.html
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("User login tiha ona:", user.email);
        window.location.assign("index.html");
    }
});

// 2. Prosesu Form Login
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const errorAlert = document.getElementById('errorAlert');
    const errorMessage = document.getElementById('errorMessage');
    const btnSubmit = document.getElementById('btnLoginSubmit');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('loginEmail').value.trim();
            const password = document.getElementById('loginPassword').value.trim();

            if (btnSubmit) {
                btnSubmit.disabled = true;
                btnSubmit.innerText = "Hein ho pasiénsia...";
            }

            try {
                if (errorAlert) errorAlert.classList.add('hidden');
                
                // Login ba Firebase Auth
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                console.log("Login Susesu:", userCredential.user);

                // Diresiona diretu ba index.html
                window.location.replace("index.html");

            } catch (error) {
                console.error("Login Erru:", error.code, error.message);
                
                if (btnSubmit) {
                    btnSubmit.disabled = false;
                    btnSubmit.innerHTML = '<span>Entra</span> <i class="fa-solid fa-right-to-bracket text-xs"></i>';
                }

                if (errorAlert && errorMessage) {
                    errorAlert.classList.remove('hidden');
                    
                    if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
                        errorMessage.textContent = "Email ka Password sala! Verifika fali.";
                    } else if (error.code === 'auth/too-many-requests') {
                        errorMessage.textContent = "Tentativa barak liu. Hein oituan ruma no koko fali.";
                    } else {
                        errorMessage.textContent = "Erru: " + error.message;
                    }
                }
            }
        });
    }
});
