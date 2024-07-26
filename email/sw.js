self.addEventListener('push', event => {
  const data = event.data.json();
  console.log('Push notification received:', data);

  // 检查 navigator 是否支持 setAppBadge 方法
  if ('setAppBadge' in navigator) {
      // 更新应用徽章
      navigator.setAppBadge(data.unreadCount).catch(error => {
          console.error('更新徽章失败:', error);
      });
  } else {
      console.warn('setAppBadge API 不被当前浏览器支持');
  }

  // 显示推送通知
  const options = {
      body: `You have ${data.unreadCount} unread emails.`,
      icon: 'icon.png'
  };
  event.waitUntil(
      self.registration.showNotification('New Email', options)
  );
});

self.addEventListener('notificationclick', event => {
  self.addEventListener('notificationclick', event => {
    event.notification.close();
    event.waitUntil(
        clients.openWindow('/').then(() => {
            // 清除未读消息计数
            clearUnreadCount();

            // 向服务器发送请求以重置未读计数
            fetch('/clearUnreadCount', { method: 'POST' })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to clear unread count on server');
                    }
                    console.log('Unread count cleared on server');
                })
                .catch(err => {
                    console.error('Failed to clear unread count on server:', err);
                });
        })
    );
});
});