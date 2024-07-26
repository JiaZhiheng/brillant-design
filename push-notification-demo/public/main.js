// 检查浏览器是否支持Service Worker
if ('serviceWorker' in navigator && 'PushManager' in window) {
  console.log('Service Worker 和 Push 已被支持');

  navigator.serviceWorker.register('service-worker.js')
  .then(function(swReg) {
    console.log('Service Worker 已被注册', swReg);

    document.getElementById('subscribe').addEventListener('click', function() {
      subscribeUser();
    });
  })
  .catch(function(error) {
    console.error('Service Worker 注册失败', error);
  });
}

function subscribeUser() {
  navigator.serviceWorker.ready.then(function(registration) {
    // 请求通知权限
    return Notification.requestPermission().then(function(permission) {
      if (permission === 'granted') {
        // 用户同意，进行订阅
        return registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array('BEyP6VkqUACD-QhEdQ3dtWHwpxYrCOZMsI-IkbKJ4UTFpMsiiRTdfhYs6Ijo6p6B7Mr3AWyQI2fjIiFmp0IUlm0')
        });
      } else {
        throw new Error('Permission not granted for Notification.');
      }
    });
  }).then(function(subscription) {
    // 订阅成功
    console.log('User is subscribed:', subscription);
    //发送订阅对象到服务端
    return sendSubscriptionToServer(subscription);
  }).catch(function(error) {
    console.error('Failed to subscribe the user:', error);
  });
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

function sendSubscriptionToServer(subscription) {
  // TODO: 发送订阅到服务端
  console.log('Subscription object:', JSON.stringify(subscription));
}

async function setBadge(count) {
  if (navigator.setAppBadge) {
    await navigator.setAppBadge(count);
  }
}

async function clearBadge() {
  if (navigator.clearAppBadge) {
    await navigator.clearAppBadge();
  }
}

// main.js
const badgeWorker = new Worker('badgeWorker.js');

function setBadgeWithWorker(count) {
  badgeWorker.postMessage({ type: 'SET_BADGE', count: count });
}

function clearBadgeWithWorker() {
  badgeWorker.postMessage({ type: 'CLEAR_BADGE' });
}