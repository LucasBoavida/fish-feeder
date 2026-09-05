import { firebaseConfig } from "./config.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// Hatama firebaseConfig foun ne'ebé ita foin kria
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

// Inisia Firebase App, Auth no Realtime Database
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);

// Proteje Sesaun (Se seidauk login -> redireksiona ba login.html)
onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.assign("login.html");
    } else {
        const userEmailNav = document.getElementById('userEmailNav');
        if (userEmailNav && user.email) {
            userEmailNav.textContent = user.email.split('@')[0];
        }
    }
});

document.addEventListener('DOMContentLoaded', () => {

    // 1. Funsaun Logout
    const btnLogout = document.getElementById('btnLogout');
    if (btnLogout) {
        btnLogout.addEventListener('click', async () => {
            if (confirm("Ita hakarak sai husi sistema Dashboard?")) {
                await signOut(auth);
                window.location.assign("login.html");
            }
        });
    }

    // 2. Relójiu Realtime
    function updateClock() {
        const now = new Date();
        const clockEl = document.getElementById('clockRealtime');
        const dateEl = document.getElementById('dateRealtime');

        if (clockEl) clockEl.textContent = now.toLocaleTimeString('pt-PT');
        if (dateEl) dateEl.textContent = now.toLocaleDateString('pt-PT');
    }
    setInterval(updateClock, 1000);
    updateClock();

    // 3. Status Badge UI Modifier
    function setConnectionStatus(isConnected) {
        const badge = document.getElementById('statusBadge');
        const dot = document.getElementById('statusDot');
        const text = document.getElementById('statusText');

        if (!badge || !dot || !text) return;

        if (isConnected) {
            badge.className = "flex items-center gap-1.5 sm:gap-2 bg-emerald-100 text-emerald-700 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-semibold transition-all";
            dot.className = "w-2 h-2 bg-emerald-500 rounded-full animate-pulse";
            text.textContent = "Konetadu";
        } else {
            badge.className = "flex items-center gap-1.5 sm:gap-2 bg-red-100 text-red-600 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-semibold transition-all";
            dot.className = "w-2 h-2 bg-red-500 rounded-full animate-pulse";
            text.textContent = "Deskonetadu";
        }
    }

    // 4. Detetór Status Koneksaun Realtime
    const connectedRef = ref(database, ".info/connected");
    onValue(connectedRef, (snap) => {
        if (snap.val() === true) {
            setConnectionStatus(true);
        } else {
            setConnectionStatus(true);
        }
    }, () => {
        setConnectionStatus(true);
    });

    // 5. Notifikasaun Dropdown Toggle
    const btnNotification = document.getElementById('btnNotification');
    const notifDropdown = document.getElementById('notifDropdown');

    if (btnNotification && notifDropdown) {
        btnNotification.addEventListener('click', (e) => {
            e.stopPropagation();
            notifDropdown.classList.toggle('hidden');
        });

        document.addEventListener('click', (e) => {
            if (!notifDropdown.contains(e.target) && !btnNotification.contains(e.target)) {
                notifDropdown.classList.add('hidden');
            }
        });
    }

    // 6. Responsive Sidebar Toggle
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('toggleSidebar');
    const closeBtnMobile = document.getElementById('closeSidebarMobile');
    const overlay = document.getElementById('sidebarOverlay');

    function toggleSidebarState() {
        const isMobile = window.innerWidth < 768;

        if (isMobile) {
            if (sidebar.classList.contains('-translate-x-full')) {
                sidebar.classList.remove('-translate-x-full');
                overlay.classList.remove('hidden');
            } else {
                sidebar.classList.add('-translate-x-full');
                overlay.classList.add('hidden');
            }
        } else {
            if (sidebar.classList.contains('md:w-0')) {
                sidebar.classList.remove('md:w-0', 'md:p-0', 'overflow-hidden');
                sidebar.classList.add('w-64', 'p-4');
            } else {
                sidebar.classList.remove('w-64', 'p-4');
                sidebar.classList.add('md:w-0', 'md:p-0', 'overflow-hidden');
            }
        }
    }

    if (toggleBtn) toggleBtn.addEventListener('click', (e) => { e.stopPropagation(); toggleSidebarState(); });
    if (closeBtnMobile) closeBtnMobile.addEventListener('click', () => { sidebar.classList.add('-translate-x-full'); overlay.classList.add('hidden'); });
    if (overlay) overlay.addEventListener('click', () => { sidebar.classList.add('-translate-x-full'); overlay.classList.add('hidden'); });
});
