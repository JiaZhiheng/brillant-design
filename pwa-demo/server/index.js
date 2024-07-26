const express = require('express');
const webPush = require('web-push');
const { sendNotificationPeriodically } = require('./utils');
const app = express();
const subscriptions = [];

app.use(express.static('../client/public'));
app.use(express.json());

app.post('/subscribe', (req, res) => {
  const subscription = req.body;
  subscriptions.push(subscription);
  res.status(201).json({});
});

const vapidKeys = {
  publicKey: 'BCV9MTSRxTS_Wga272utgt2b7GLrqXW4M7S7A2VF7ba_EK-2bQK0F0Sing17w2l_NzX5G5ROQN1ZAktZi27Rl4k',
  privateKey: 'W_VQYHmsB_Pmd3-dggE00f9HfCO7YsJGW2XiJxgZktc'
};

webPush.setVapidDetails(
  'mailto:your-email@example.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

sendNotificationPeriodically(subscriptions, webPush);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});