
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('./db');

router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send("Champs requis manquants");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        await db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);
        res.status(201).send("Utilisateur inscrit !");
    } catch (err) {
        console.error(err);
        res.status(500).send("Erreur serveur");
    }
});


router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send("Champs requis manquants");
    }

    try {
        db.get('SELECT * FROM users WHERE username = ?', [username], async (err, row) => {
            if (err) {
                console.error(err);
                return res.status(500).send("Erreur serveur");
            }

            if (!row) {
                return res.status(400).send("Utilisateur non trouvé");
            }

            const match = await bcrypt.compare(password, row.password);
            if (match) {
                req.session.user = { id: row.id, username: row.username };
                return res.status(200).send("Connexion réussie !");
            } else {
                return res.status(401).send("Mot de passe incorrect");
            }
        });
    } catch (e) {
        console.error(e);
        res.status(500).send("Erreur interne");
    }
});

// Dans auth.js
router.get('/me', (req, res) => {
    if (req.session.user) {
        res.json({ username: req.session.user.username });

    } else {
        res.status(401).json({ error: 'Not authenticated' });
    }
});




router.post('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send("Erreur lors de la déconnexion");
        }
        res.send("Déconnecté !");
    });
});


module.exports = router;
