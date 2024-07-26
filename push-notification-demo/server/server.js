const express = require('express');
const webpush = require('web-push');
const bodyParser = require('body-parser');
const path = require('path');

// VAPID keys 应当替换为你自己生成的一组keys
const vapidKeys = {
  publicKey: 'BEyP6VkqUACD-QhEdQ3dtWHwpxYrCOZMsI-IkbKJ4UTFpMsiiRTdfhYs6Ijo6p6B7Mr3AWyQI2fjIiFmp0IUlm0',
  privateKey: 'dl_83nL_PAuWNXhDIK4WZBMUvkaKy_fi9Jjf1UYloqw'
};

webpush.setVapidDetails(
  'mailto:example@yourdomain.org',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

const app = express();
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, '../public'))); // 静态文件目录设置

// 存储订阅对象
let subscriptions = {};

app.post('/subscribe', (req, res) => {
  const subscription = req.body;
  // 对于演示目的，我们将订阅对象存储在内存中
  const subscriptionKey = JSON.stringify(subscription);
  subscriptions[subscriptionKey] = subscription;
  
  res.status(201).json({message: 'Subscription received'});
});

function sendNotification(subscription, dataToSend='') {
  webpush.sendNotification(subscription, dataToSend)
    .catch((err) => {
      console.error("Error sending notification, reason: ", err);
      delete subscriptions[JSON.stringify(subscription)];
    });
}

const notificationPayload = JSON.stringify({
  title: '定时消息',
  body: '这是定时发送的信息。',
  icon: 'icon.png',
  badge: 'badge.png'
});

// 定时发送通知
setInterval(() => {
  console.log('发送定时通知');
  Object.values(subscriptions).forEach(subscription => {
    sendNotification(subscription, notificationPayload);
  });
}, 10000); // 10秒钟

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});