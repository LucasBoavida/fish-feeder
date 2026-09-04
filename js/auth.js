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

  appId: "1:498255146529:web:cabcdaf269e970c941bd60",

  measurementId: "G-2YQVEHL7HK"

};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Se utilízador dadaun entra tiha ona, haruka diretu ba Dashboard (index.html)
onAuthStateChanged(auth, (user) => {
    if (user) {
        window.location.href = "index.html";
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const errorAlert = document.getElementById('errorAlert');
    const errorMessage = document.getElementById('errorMessage');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;

            try {
                errorAlert.classList.add('hidden');
                await signInWithEmailAndPassword(auth, email, password);
                window.location.href = "index.html";
            } catch (error) {
                console.error("Login Error:", error);
                errorAlert.classList.remove('hidden');
                errorMessage.textContent = "Email ka password sala! Favor verifika fali.";
            }
        });
    }
});
