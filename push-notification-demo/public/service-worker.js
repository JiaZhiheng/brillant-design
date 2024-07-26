self.addEventListener('push', function(event) {
  let pushMessage = event.data.json();

  const options = {
    body: pushMessage.body,
    icon: 'icon.png',
    badge: 'badge.png'
  };

  event.waitUntil(
    self.registration.showNotification(pushMessage.title, options)
  );
});


self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('push', (event) => {
  const data = event.data.json();
  self.registration.showNotification(data.title, {
    body: data.body,
    icon: '/path/to/icon.png',
  });
});

self.addEventListener('pushsubscriptionchange', (event) => {
  event.waitUntil(
    self.registration.pushManager.subscribe(event.oldSubscription.options)
    .then((subscription) => {
      // TODO: Send new subscription to server
    })
  );
});