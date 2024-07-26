function sendNotificationPeriodically(subscriptions, webPush) {
  setInterval(() => {
    const message = {
      title: "New Notification",
      body: "This is a message from the server",
      data: { count: Math.floor(Math.random() * 100) }
    };
    subscriptions.forEach(subscription => {
      webPush.sendNotification(subscription, JSON.stringify(message))
        .catch(error => console.error('Error sending notification', error));
    });
  }, 10000);
}

module.exports = { sendNotificationPeriodically };