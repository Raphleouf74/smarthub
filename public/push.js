// push.js
const express = require('express');
const webpush = require('web-push');
const router = express.Router();

const VAPID_PUBLIC_KEY = 'BItI9diKW9m5auaIa_V_ryMAxbCQwBdGkGK3XhNWQ8wO4y9LW92wXMVG2JtazM_CvTA0KwawOoGqlQmFxxcQK9E';
const VAPID_PRIVATE_KEY = '_b1gM05nPWLO0R8SBLh9QTHfcYLu1v6S1ycNWg0wURo';

webpush.setVapidDetails(
    'mailto:contact@smarthub.com',
    VAPID_PUBLIC_KEY,
    VAPID_PRIVATE_KEY
);

// 🔒 Pour stocker les abonnements temporairement (à améliorer avec une DB !)
let subscriptions = [];

router.post('/subscribe', (req, res) => {
    const subscription = req.body;
    subscriptions.push(subscription); // ⚠️ en prod : enregistrer dans une vraie DB
    res.status(201).json({ message: 'Abonnement enregistré' });
});

// 🔔 Pour tester l'envoi d'une notification
router.post('/send-notification', async (req, res) => {
    const payload = JSON.stringify({
        title: 'SmartHub',
        body: 'Nouvelle version en ligne. Rechargez la page !'
    });

    const results = await Promise.allSettled(
        subscriptions.map(sub =>
            webpush.sendNotification(sub, payload)
        )
    );

    res.status(200).json({ results });
});

module.exports = router;
