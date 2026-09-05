import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// Configurasaun Firebase
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

// 1. Verifika Sesaun: Se login tiha ona, haruka diretu ba index.html
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("User ativu hela:", user.email);
        window.location.href = "index.html";
    }
});

// 2. Kódigu Form Login ho Redireksiona Garanti
document.addEventListener('DOMContentLoaded', () => {
    // Foti elementus husi HTML
    const loginForm = document.querySelector('form');
    const emailInput = document.querySelector('input[type="email"]');
    const passwordInput = document.querySelector('input[type="password"]');
    const submitBtn = document.querySelector('button[type="submit"]');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = emailInput ? emailInput.value.trim() : "";
            const password = passwordInput ? passwordInput.value.trim() : "";

            if (!email || !password) {
                alert("Favor hatama Email no Password!");
                return;
            }

            // Muta botaun nia textu ba Loading
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerText = "Prosesa hela...";
            }

            try {
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                console.log("Susesu tama:", userCredential.user);
                
                // Redireksiona dudu ba Dashboard
                window.location.href = "index.html";

            } catch (error) {
                console.error("Erru login:", error);
                alert("Erru Login: " + error.message);
                
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerText = "Entra";
                }
            }
        });
    }
});
