const express = require('express');
const bodyParser = require('body-parser');
const webpush = require('web-push');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// 用于保存订阅的文件
const subscriptionsFile = 'subscriptions.json';

// VAPID 公钥和私钥
const publicVapidKey = 'BGbYUEvYUgjyt-FDzEzmO01y_IJUZWXhi_Yfhs_QoydgU9GSEjm5Pl6dsQQhoTLNqXfe51LuXR9i92Ce_q0eu-c';
const privateVapidKey = '7bM3s9YHN4pPy56YoE14r6mlVpM3DKc-0fkDGWnEjhg';

// 设置VAPID
webpush.setVapidDetails(
  'mailto:you@example.com',
  publicVapidKey,
  privateVapidKey
);

// 使用 body-parser 作为中间件解析 JSON 请求体
app.use(bodyParser.json());

// 静态文件路径
app.use(express.static(path.join(__dirname, 'public')));

// 定期发送推送通知
let unreadCount = 0;
setInterval(() => {
  unreadCount++;
  const payload = JSON.stringify({
    title: 'Push Test',
    unreadCount: unreadCount
  });

  // 从文件读取所有订阅
  if (fs.existsSync(subscriptionsFile)) {
    let subscriptions = JSON.parse(fs.readFileSync(subscriptionsFile));

    // 检查是否存在订阅
    if (subscriptions.length === 0) {
      console.log('No subscriptions to push to.');
    } else {
      // 向所有订阅发送推送通知
      subscriptions.forEach(subscription => {
        webpush.sendNotification(subscription, payload).then(response => {
          console.log('Push notification sent successfully:', response);
        }).catch(error => {
          console.error('Sending push notification failed:', error);
        });
        console.log('Notification sent to subscription:', subscription);
      });
    }
  } else {
    console.log('No subscriptions file found.');
  }
}, 3000);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});