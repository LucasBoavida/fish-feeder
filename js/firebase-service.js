import { firebaseConfig } from './config.js';

// Inisializa Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Rai dadus foun ba Firebase Realtime Database
export function raiDadusBaFirebase(temp, food, callbackSuccess) {
    const timestamp = new Date().toISOString();
    database.ref('historiu_sensor').push({
        temperatura: temp,
        nivel_aihan: food,
        tempo: timestamp
    }).then(() => {
        if(callbackSuccess) callbackSuccess();
    });
}

// Foti dadus ikus husi Firebase hodi hatama ba Tabela
export function fotiDadusFirebase(limit, callback) {
    database.ref('historiu_sensor').limitToLast(limit).once('value', (snapshot) => {
        const listData = [];
        if (snapshot.exists()) {
            snapshot.forEach((childSnapshot) => {
                listData.push(childSnapshot.val());
            });
        }
        callback(listData);
    });
}
