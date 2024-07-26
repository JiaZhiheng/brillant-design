const webpush = require('web-push');

// 生成 VAPID 公钥和私钥
const vapidKeys = webpush.generateVAPIDKeys();

console.log('Public VAPID Key:', vapidKeys.publicKey);
console.log('Private VAPID Key:', vapidKeys.privateKey);