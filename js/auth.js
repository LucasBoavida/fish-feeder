import { firebaseConfig } from "./config.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const firebaseConfig = {
      apiKey: "AIzaSySySyFktnxXlR0P3EnBMf7p1DEwdSHb8",
      authDomain: "fish-feeder-db.firebaseapp.com",
      database URL: "https://fish-feeder-db-default-rtdb.asia-southeast1.firebasedatabase.app",
      projectId: "fish-feeder-db",
      storageBucket: "fish-feeder-db.firebasestorage.app",
      messagingSenderId: "498255146529",
      appId: "1:498255146529:web:1cfc310a6461e348441bd60",
      measurementId: "G-32L08HNN52"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// 1. Redireksiona Otomátiku se Login Tiha Ona
onAuthStateChanged(auth, (user) => {
    if (user) {
        window.location.assign("index.html");
    }
});

// 2. Kódigu Form Login ho Mensagem Error Loloos
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('form');
    const emailInput = document.querySelector('input[type="email"]');
    const passwordInput = document.querySelector('input[type="password"]');
    const submitBtn = document.querySelector('button[type="submit"]');
    const errorAlert = document.getElementById('errorAlert');
    const errorMessage = document.getElementById('errorMessage');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = emailInput ? emailInput.value.trim() : "";
            const password = passwordInput ? passwordInput.value.trim() : "";

            // Subar fali alert error se iha
            if (errorAlert) errorAlert.classList.add('hidden');

            if (!email || !password) {
                showError("Favor preenxe Email no Password sira hotu!");
                return;
            }

            // Troka textu botaun ba loading
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerText = "Prosesa hela...";
            }

            try {
                // Tentativa Login
                await signInWithEmailAndPassword(auth, email, password);
                
                // Se susesu, lori diretu ba Dashboard
                window.location.assign("index.html");

            } catch (error) {
                console.error("Firebase Auth Error:", error.code);

                // Fila botaun ba orijinál
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerText = "Entra";
                }

                // Hamosu mensagem spesífiku ba utilizadór
                if (error.code === 'auth/invalid-credential' || 
                    error.code === 'auth/user-not-found' || 
                    error.code === 'auth/wrong-password' ||
                    error.code === 'auth/invalid-email') {
                    showError("Email ka Password sala! Favor verifika no koko fali.");
                } else if (error.code === 'auth/too-many-requests') {
                    showError("Tentativa barak liu! Hein minutu balun no koko fali.");
                } else {
                    showError("Erru: " + error.message);
                }
            }
        });
    }

    // Funsaun Auxiliár atu hamosu Mensagem Erru iha UI
    function showError(msg) {
        if (errorAlert && errorMessage) {
            errorMessage.textContent = msg;
            errorAlert.classList.remove('hidden');
        } else {
            alert(msg);
        }
    }
});
