const CACHE_NAME = 'tokyo-guide-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  // アイコンファイル（必要に応じて）
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// インストール時にキャッシュを追加
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// リクエストをインターセプトしてキャッシュがあれば返す
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // キャッシュがあればそれを返す
        if (response) {
          return response;
        }
        // なければネットワークにフォールバック
        return fetch(event.request)
          .then(networkResponse => {
            // 必要に応じて新しいリソースをキャッシュに追加（今回は静的のみ）
            return networkResponse;
          });
      })
  );
});

// 古いキャッシュの削除
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});