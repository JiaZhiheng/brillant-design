// badgeWorker.js
onmessage = function(e) {
  if (e.data && e.data.type === 'SET_BADGE') {
    self.navigator.setAppBadge(e.data.count).catch((error) => {
      console.error('Error setting app badge in Worker:', error);
    });
  } else if (e.data && e.data.type === 'CLEAR_BADGE') {
    self.navigator.clearAppBadge().catch((error) => {
      console.error('Error clearing app badge in Worker:', error);
    });
  }
};