export function initPushNotifications() {
  if ('Notification' in window && navigator.serviceWorker) {
    navigator.serviceWorker.ready.then(registration => {
      registration.pushManager.getSubscription().then(subscription => {
        if (!subscription) {
          return registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: 'BCV9MTSRxTS_Wga272utgt2b7GLrqXW4M7S7A2VF7ba_EK-2bQK0F0Sing17w2l_NzX5G5ROQN1ZAktZi27Rl4k'
          });
        }
        return subscription;
      }).then(subscription => {
        fetch('/subscribe', {
          method: 'POST',
          body: JSON.stringify(subscription),
          headers: {
            'Content-Type': 'application/json'
          }
        });
      });

      navigator.serviceWorker.addEventListener('message', event => {
        updateBadge(event.data);
      });
    });
  }
}

function updateBadge(data) {
  if ('setAppBadge' in navigator) {
    navigator.setAppBadge(data.count);
  } else if ('setClientBadge' in navigator) {
    navigator.setClientBadge(data.count);
  }
}