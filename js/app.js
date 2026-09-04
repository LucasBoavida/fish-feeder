import { raiDadusBaFirebase, fotiDadusFirebase } from './firebase-service.js';
import { initMQTT, publishFeed, publishSchedule } from './mqtt-service.js';
import { initChart, updateChartData } from './chart-service.js';

// Função atu Renderiza Tabela
function renderTable() {
    fotiDadusFirebase(10, (listData) => {
        const tabelaBody = document.getElementById('tabelaBody');
        tabelaBody.innerHTML = '';

        if (listData.length === 0) {
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

        document.getElementById('totalRecords').innerText = listData.length;
    });
}

// Inisialisasaun Bainhira Window Load
window.addEventListener('DOMContentLoaded', () => {
    // 1. Init Chart
    initChart('tempChart');

    // 2. Init Firebase Table Data
    renderTable();

    // 3. Init MQTT Connection
    initMQTT(
        // Callback no Message Received
        (data) => {
            if (data.temp !== undefined) {
                document.getElementById('tempVal').innerText = data.temp + ' °C';
                updateChartData(data.temp);

                const statusEl = document.getElementById('tempStatus');
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

            if (data.food !== undefined) {
                document.getElementById('foodVal').innerText = data.food + ' %';
                document.getElementById('foodBar').style.width = data.food + '%';
            }

            // Rai ba Firebase DB
            if (data.temp !== undefined && data.food !== undefined) {
                raiDadusBaFirebase(data.temp, data.food, () => {
                    renderTable();
                });
            }
        },
        // Callback Status Connection
        (isConnected) => {
            const badge = document.getElementById('statusBadge');
            if (isConnected) {
                badge.className = "flex items-center gap-2 bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-full text-xs font-semibold";
                badge.innerHTML = '<span class="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span> Konetadu';
            } else {
                badge.className = "flex items-center gap-2 bg-red-100 text-red-600 px-3 py-1.5 rounded-full text-xs font-semibold";
                badge.innerHTML = '<span class="w-2 h-2 bg-red-500 rounded-full"></span> Deskonetadu';
            }
        }
    );

    // Event Listeners ba Botaun sira
    document.getElementById('btnFeed').addEventListener('click', publishFeed);
    document.getElementById('btnSchedule').addEventListener('click', () => {
        const s1 = document.getElementById('sched1').value;
        const s2 = document.getElementById('sched2').value;
        publishSchedule(s1, s2);
    });
    document.getElementById('btnRefreshTable').addEventListener('click', renderTable);

    // 4. Toggle Subar / Hamosu Sidebar
    const sidebar = document.getElementById('sidebar');
    const toggleBtn = document.getElementById('toggleSidebar');
    toggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('-ml-64');
    });

    // 5. Toggle Dropdown Notifikasaun
    const btnNotif = document.getElementById('btnNotification');
    const notifDropdown = document.getElementById('notifDropdown');
    btnNotif.addEventListener('click', (e) => {
        e.stopPropagation();
        notifDropdown.classList.toggle('hidden');
    });

    // Taka dropdown bainhira klik iha li'ur
    document.addEventListener('click', () => {
        if (!notifDropdown.classList.contains('hidden')) {
            notifDropdown.classList.add('hidden');
        }
    });
});
