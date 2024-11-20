const express = require('express');
const app = express();
app.use(express.json());
const http = require('http');
const {Server}=require('socket.io');
const cors = require('cors');
const axios = require('axios');
const path = require('path');
app.use(cors());

const connectionLimits = {}; // Pour stocker les compteurs de connexions par IP
const blacklistedIps = new Set(); // Ensemble des IPs blacklistées
const MAX_CONNECTIONS = 3; 
const TIME_WINDOW = 3000; 
const server = http.createServer(app);

const io = new Server(server,{
    cors :{
        origin : "http://188.165.222.102:4320"
	}
})

const sqlite3 = require('sqlite3');
const { open } = require('sqlite');


app.post('/envoyerDonnees', (req, res) => {
    console.log(req.body); // Pour voir les données reçues
    res.send('Données reçues');
});

let db;
async function main() {
    try {
        db = await open({
            filename: 'flop.db',
            driver: sqlite3.Database
        });
        console.log('Connexion à la base de données réussie');
    } catch (e) {
        console.error("Erreur lors de la connexion à la base de données : ", e);
    }
}
main().catch(console.error);

function envoyerDonnees(data) {
    axios.post('http://188.165.222.102:4002/envoyerDonnees', data)
    .then(response => {
        console.log('Succès:', response.data);
    })
    .catch(error => {
        console.error('Erreur:', error);
    });
}


io.on("connection",(socket)=>{
    console.log(`L'utilisateur ${socket.id} vien de se connecter`);

    let clientIp = socket.request.connection.remoteAddress;
    if (clientIp.substr(0, 7) == "::ffff:") {
        clientIp = clientIp.substr(7);
    }
    console.log(clientIp);

    if (blacklistedIps.has(clientIp)) {
        console.log(`Connection bloquée de l'IP blacklistée : ${clientIp}`);
        return; 
    }

    const currentTime = Date.now();

    if (!connectionLimits[clientIp]) {
        connectionLimits[clientIp] = { count: 1, startTime: currentTime };
    } else {
        connectionLimits[clientIp].count++;
        const timeDiff = currentTime - connectionLimits[clientIp].startTime;

        if (timeDiff <= TIME_WINDOW && connectionLimits[clientIp].count > MAX_CONNECTIONS) {
            console.log(`Blacklisting IP: ${clientIp}`);
            blacklistedIps.add(clientIp);
            return;
        }

        if (timeDiff > TIME_WINDOW) {
            connectionLimits[clientIp] = { count: 1, startTime: currentTime };
        }
    }


    socket.on('afficheMenu',()=>{
        socket.emit('affichageMenu');
    })

    socket.on('recupName', async()=>{
        const prenom = await db.all('SELECT prenom FROM prenom');
        socket.emit('prenom',prenom);
    });

    socket.on('envoyerDonnees', async (data)=>{
        const existingPrenom = await db.get('SELECT 1 FROM prenom WHERE prenom = ?', data.prenom);
        if (existingPrenom) {
            console.log(data.prenom, data.selectCategorie, data.commentaire)
            await db.run('INSERT INTO dude (prenom, categorie ,commentaire) VALUES (?, ?, ?)', data.prenom, data.selectCategorie, data.commentaire);
            await db.run(`UPDATE prenom SET ${data.selectCategorie} = (SELECT COUNT(*) FROM dude WHERE categorie = ? AND prenom = ?) WHERE prenom = ?`,data.selectCategorie, data.prenom, data.prenom);
			envoyerDonnees(data);
        }
        else{
            console.log(`Le prénom ${data.prenom} n'existe pas dans la base de données.`);
        }
    });

    socket.on('getClassement', async (categorie)=>{
        const classement = await db.all(`SELECT * FROM prenom ORDER BY ${categorie} DESC`);
        socket.emit('seeClassement', classement);
    })

    socket.on('getCamembert', async (categorie)=>{
        const classement = await db.all(`SELECT * FROM prenom ORDER BY ${categorie} DESC`);
        socket.emit('seeCamembert', classement);
    })

    socket.on('recupData',async(prenom,categorie)=>{
        const existingPrenom = await db.get('SELECT 1 FROM prenom WHERE prenom = ?',prenom);
        if (existingPrenom) {
            data = await db.all('SELECT * FROM dude WHERE prenom = ? AND categorie = ?',prenom,categorie);
            socket.emit('sendData',data);
        }
        else{
            console.log(`Le prénom ${prenom} n'existe pas dans la base de données.`);
        }
    })
})

server.listen(4321, () => {
    console.log('Le serveur écoute sur le port 4001');
});