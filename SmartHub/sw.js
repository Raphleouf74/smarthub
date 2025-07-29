//sw.js
self.addEventListener('push', event => {
    const data = event.data?.json() || {};
    const title = data.title || 'SmartHub';
    const options = {
        body: data.body,
        icon: 'medias/logo.png',
        badge: '/favicon.ico',
        data
    };
    event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', event => {
    event.notification.close();
    event.waitUntil(clients.openWindow('/'));
});
