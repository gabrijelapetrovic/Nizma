const CACHE = 'venue-shell-v10';
const PRECACHE = ['/', '/offline.html', '/favicon.svg', '/site.webmanifest'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(PRECACHE)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)))).then(() => self.clients.claim())
  );
});

function isImagePath(pathname) {
  return pathname.startsWith('/photos/') || /\.(webp|png|jpe?g|gif|avif|svg)$/i.test(pathname);
}

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put('/', copy));
          return response;
        })
        .catch(() => caches.match('/') || caches.match('/offline.html'))
    );
    return;
  }

  if (url.pathname.startsWith('/js/') || url.pathname.endsWith('.css')) return;

  if (url.pathname.startsWith('/assets/') || url.pathname.startsWith('/photos/')) {
    if (!isImagePath(url.pathname)) return;
    event.respondWith(
      fetch(request, { cache: 'no-cache' })
        .then((response) => {
          const type = response.headers.get('content-type') || '';
          if (response.ok && type.startsWith('image/')) {
            const copy = response.clone();
            caches.open(CACHE).then((cache) => cache.put(request, copy));
            return response;
          }
          return caches.match(request).then((cached) => {
            const cachedType = cached?.headers.get('content-type') || '';
            if (cached && cached.ok && cachedType.startsWith('image/')) return cached;
            return response;
          });
        })
        .catch(() =>
          caches.match(request).then((cached) => cached || Response.error())
        )
    );
  }
});
