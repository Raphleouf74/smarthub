//server.js
const express = require('express');
const session = require('express-session');
const cors = require('cors'); // ⬅️ AJOUT

const bodyParser = require('body-parser');
const authRoutes = require('./Server/auth');

const app = express();
const PORT = 3000;

// ✅ Autoriser les requêtes CORS
app.use(cors({
    origin: 'http://127.0.0.1:5500', // frontend
    credentials: true              // pour les cookies / sessions
}));

// Middlewares
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(session({
    secret: 'supersecret',
    resave: false,
    saveUninitialized: false
}));

// Routes
app.use('/auth', authRoutes);



// Middleware pour parser le JSON
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Sessions
app.use(session({
    secret: 'supersecret',
    resave: false,
    saveUninitialized: false
}));

// Servir les fichiers frontend (HTML, CSS, etc.)
app.use(express.static(__dirname + '/../'));

// Routes
app.use('/auth', authRoutes);

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`No errors on server.js, server running on http://localhost:${PORT}`);
});
const pushRoutes = require('./push'); // si ton fichier est Server/push.js
app.use(express.json()); // déjà présent normalement
app.use('/push', pushRoutes);
