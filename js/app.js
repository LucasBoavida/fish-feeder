import { raiDadusBaFirebase, fotiDadusFirebase } from './firebase-service.js';
import { initMQTT, publishFeed, publishSchedule } from './mqtt-service.js';
import { initChart, updateChartData } from './chart-service.js';

// Funsaun atu Renderiza Tabela
function renderTable() {
    fotiDadusFirebase(10, (listData) => {
        const tabelaBody = document.getElementById('tabelaBody');
        if (!tabelaBody) return;
        
        tabelaBody.innerHTML = '';

        if (!listData || listData.length === 0) {
            tabelaBody.innerHTML = '<tr><td colspan="4" class="text-center py-4 text-slate-400">Seidauk iha dadus.</td></tr>';
            return;
        }

        listData.reverse().forEach((val) => {
            const dataHora = new Date(val.tempo).toLocaleString();
            let statusBadge = '<span class="bg-emerald-100 text-emerald-700 text-xs px-2.5 py-0.5 rounded-full font-semibold">Normál</span>';
            if (val.temperatura > 30) statusBadge = '<span class="bg-red-100 text-red-700 text-xs px-2.5 py-0.5 rounded-full font-semibold">Manas</span>';
            if (val.temperatura < 22) statusBadge = '<span class="bg-blue-100 text-blue-700 text-xs px-2.5 py-0.5 rounded-full font-semibold">Malarin</span>';

            const row = `
                <tr class="hover:bg-slate-50 transition">
                    <td class="px-4 py-3 font-medium text-slate-700">${dataHora}</td>
                    <td class="px-4 py-3 font-mono text-slate-800">${val.temperatura} °C</td>
                    <td class="px-4 py-3 font-mono text-slate-800">${val.nivel_aihan} %</td>
                    <td class="px-4 py-3">${statusBadge}</td>
                </tr>
            `;
            tabelaBody.innerHTML += row;
        });

        const totalEl = document.getElementById('totalRecords');
        if (totalEl) totalEl.innerText = listData.length;
    });
}

// Executa Bainhira HTML Hotu-Hotu Ready Ona
window.addEventListener('DOMContentLoaded', () => {

    // 1. Inisialisasaun Chart, Table, & MQTT
    initChart('tempChart');
    renderTable();

    initMQTT(
        (data) => {
            if (data.temp !== undefined) {
                const tempEl = document.getElementById('tempVal');
                if (tempEl) tempEl.innerText = data.temp + ' °C';
                updateChartData(data.temp);

                const statusEl = document.getElementById('tempStatus');
                if (statusEl) {
                    if (data.temp > 30) {
                        statusEl.innerText = "Manas!";
                        statusEl.className = "text-xs font-semibold text-red-500";
                    } else if (data.temp < 22) {
                        statusEl.innerText = "Malarin!";
                        statusEl.className = "text-xs font-semibold text-blue-500";
                    } else {
                        statusEl.innerText = "Normál";
                        statusEl.className = "text-xs font-semibold text-emerald-500";
                    }
                }
            }

            if (data.food !== undefined) {
                const foodEl = document.getElementById('foodVal');
                const foodBar = document.getElementById('foodBar');
                if (foodEl) foodEl.innerText = data.food + ' %';
                if (foodBar) foodBar.style.width = data.food + '%';
            }

            if (data.temp !== undefined && data.food !== undefined) {
                raiDadusBaFirebase(data.temp, data.food, () => {
                    renderTable();
                });
            }
        },
        (isConnected) => {
            const badge = document.getElementById('statusBadge');
            if (badge) {
                if (isConnected) {
                    badge.className = "flex items-center gap-1.5 sm:gap-2 bg-emerald-100 text-emerald-700 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-semibold";
                    badge.innerHTML = '<span class="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span><span class="hidden sm:inline">Konetadu</span>';
                } else {
                    badge.className = "flex items-center gap-1.5 sm:gap-2 bg-red-100 text-red-600 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-semibold";
                    badge.innerHTML = '<span class="w-2 h-2 bg-red-500 rounded-full"></span><span class="hidden sm:inline">Deskonetadu</span>';
                }
            }
        }
    );

    // 2. Event Listeners ba Action Buttons
    const btnFeed = document.getElementById('btnFeed');
    const btnSchedule = document.getElementById('btnSchedule');
    const btnRefresh = document.getElementById('btnRefreshTable');

    if (btnFeed) btnFeed.addEventListener('click', publishFeed);
    if (btnSchedule) {
        btnSchedule.addEventListener('click', () => {
            const s1 = document.getElementById('sched1').value;
            const s2 = document.getElementById('sched2').value;
            publishSchedule(s1, s2);
        });
    }
    if (btnRefresh) btnRefresh.addEventListener('click', renderTable);

    // 3. LÓJIKA SIDEBAR RESPONSIVE (Fix Toggle & Overlay)
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('toggleSidebar');
    const closeBtnMobile = document.getElementById('closeSidebarMobile');
    const overlay = document.getElementById('sidebarOverlay');

    if (toggleBtn && sidebar) {
        toggleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            
            // Iha Screen Desktop (md:)
            if (window.innerWidth >= 768) {
                sidebar.classList.toggle('md:hidden');
            } 
            // Iha Screen Mobile (<768px)
            else {
                if (sidebar.classList.contains('-translate-x-full')) {
                    sidebar.classList.remove('-translate-x-full');
                    if (overlay) overlay.classList.remove('hidden');
                } else {
                    sidebar.classList.add('-translate-x-full');
                    if (overlay) overlay.classList.add('hidden');
                }
            }
        });
    }

    const hideMobileSidebar = () => {
        if (sidebar) sidebar.classList.add('-translate-x-full');
        if (overlay) overlay.classList.add('hidden');
    };

    if (closeBtnMobile) closeBtnMobile.addEventListener('click', hideMobileSidebar);
    if (overlay) overlay.addEventListener('click', hideMobileSidebar);

    // 4. Lójika Dropdown Notifikasaun
    const btnNotif = document.getElementById('btnNotification');
    const notifDropdown = document.getElementById('notifDropdown');

    if (btnNotif && notifDropdown) {
        btnNotif.addEventListener('click', (e) => {
            e.stopPropagation();
            notifDropdown.classList.toggle('hidden');
        });

        document.addEventListener('click', () => {
            notifDropdown.classList.add('hidden');
        });
    }
});
