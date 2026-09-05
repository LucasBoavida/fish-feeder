import { firebaseConfig } from "./config.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// Inisia Firebase App no Auth
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// 1. Dudu diretu ba Dashboard se panteo login ativu tiha ona
onAuthStateChanged(auth, (user) => {
    if (user) {
        window.location.assign("index.html");
    }
});

// 2. Event Listener ba Form Login
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('loginEmail');
    const passwordInput = document.getElementById('loginPassword');
    const submitBtn = document.getElementById('btnLoginSubmit');
    const errorAlert = document.getElementById('errorAlert');
    const errorMessage = document.getElementById('errorMessage');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = emailInput ? emailInput.value.trim() : "";
            const password = passwordInput ? passwordInput.value.trim() : "";

            // Subar alert error se iha tiha ona
            if (errorAlert) errorAlert.classList.add('hidden');

            if (!email || !password) {
                showError("Favor preenxe Email no Password sira hotu!");
                return;
            }

            // Troka textu botaun no fo efeitu visual
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = `<span>Prosesa hela...</span><i class="fa-solid fa-spinner animate-spin text-xs"></i>`;
            }

            try {
                // Tentativa autentikasaun
                await signInWithEmailAndPassword(auth, email, password);
                
                // Lori ba Dashboard
                window.location.assign("index.html");

            } catch (error) {
                console.error("Firebase Auth Error:", error.code);

                // Fila botaun ba orijinál
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = `<span>Entra</span><i class="fa-solid fa-right-to-bracket text-xs"></i>`;
                }

                // Hamosu mensagem error espesífiku iha Alert Box
                if (error.code === 'auth/invalid-credential' || 
                    error.code === 'auth/user-not-found' || 
                    error.code === 'auth/wrong-password' ||
                    error.code === 'auth/invalid-email') {
                    showError("Email ka Password sala! Favor verifika fali.");
                } else if (error.code === 'auth/too-many-requests') {
                    showError("Tentativa barak liu! Hein minutu balun no koko fali.");
                } else {
                    showError("Erru: " + error.message);
                }
            }
        });
    }

    // Funsaun auxiliár atu hatudu Error Alert Box
    function showError(msg) {
        if (errorAlert && errorMessage) {
            errorMessage.textContent = msg;
            errorAlert.classList.remove('hidden');
        } else {
            alert(msg);
        }
    }
});
