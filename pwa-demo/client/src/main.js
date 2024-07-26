import { registerSW } from './registerSW.js';
import { initPushNotifications } from './push-notifications.js';

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    registerSW();
    initPushNotifications();
  });
}