// ============================================================
//  Tati App - Service Worker
//  Strategia cache:
//   - "shell"   : precache HTML, manifest, icone (install)
//   - "runtime" : cache dinamica per CDN (Leaflet, FontAwesome, Google Fonts)
//                 e per le foto dei posti (assets/posti/*)
//   - "tiles"   : cache opportunistica per le tile OpenStreetMap / CARTO
//                 (cos� le aree gi� visitate restano visibili offline)
// ============================================================

const VERSION = 'v86';
const SHELL_CACHE = `tati-shell-${VERSION}`;
const RUNTIME_CACHE = `tati-runtime-${VERSION}`;
const TILES_CACHE = `tati-tiles-${VERSION}`;

const SHELL_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './assets/icon-192.png',
  './assets/icon-512.png',
  './assets/welcome.jpg'
];

// Massimo numero di tile da tenere in cache (LRU-ish)
const MAX_TILES = 300;

// ---------- INSTALL ----------
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then((cache) => cache.addAll(SHELL_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// ---------- ACTIVATE ----------
self.addEventListener('activate', (event) => {
  const allowed = [SHELL_CACHE, RUNTIME_CACHE, TILES_CACHE];
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => !allowed.includes(k)).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// ---------- HELPERS ----------
function isTileRequest(url) {
  return /(tile\.openstreetmap\.org|basemaps\.cartocdn\.com|server\.arcgisonline\.com)/.test(url.hostname);
}

function isCdnRequest(url) {
  return /(unpkg\.com|cdn\.jsdelivr\.net|cdnjs\.cloudflare\.com|fonts\.googleapis\.com|fonts\.gstatic\.com|ajax\.googleapis\.com)/.test(url.hostname);
}

function isPostiPhoto(url) {
  return url.pathname.includes('/assets/posti/');
}

function isStreamingMedia(req, url) {
  return req.destination === 'audio' || req.destination === 'video'
    || /\.(mp3|mp4|m4a|ogg|wav|webm|mov)$/i.test(url.pathname);
}

// Mantiene la cache delle tile sotto una certa soglia
async function trimCache(cacheName, maxItems) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  if (keys.length <= maxItems) return;
  // elimina le pi� vecchie (le prime nella lista)
  const toDelete = keys.length - maxItems;
  for (let i = 0; i < toDelete; i++) await cache.delete(keys[i]);
}

// Strategia: stale-while-revalidate per CDN e foto posti
async function staleWhileRevalidate(req, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(req);
  const fetchPromise = fetch(req).then((resp) => {
    if (resp && resp.status === 200) cache.put(req, resp.clone()).catch(() => { });
    return resp;
  }).catch(() => cached);
  return cached || fetchPromise;
}

// Strategia tile: cache-first con update in background
async function tileStrategy(req) {
  const cache = await caches.open(TILES_CACHE);
  const cached = await cache.match(req);
  if (cached) {
    // refresh in background, ma non aspettarlo
    fetch(req).then((resp) => {
      if (resp && resp.status === 200) cache.put(req, resp.clone()).catch(() => { });
    }).catch(() => { });
    return cached;
  }
  try {
    const resp = await fetch(req);
    if (resp && resp.status === 200) {
      cache.put(req, resp.clone()).catch(() => { });
      // trim opportunistico
      trimCache(TILES_CACHE, MAX_TILES);
    }
    return resp;
  } catch (e) {
    // tile non disponibile e non in cache: rispondi 504 cos� Leaflet mostra il grigio
    return new Response('', { status: 504, statusText: 'offline tile' });
  }
}

// ---------- FETCH ----------
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  let url;
  try { url = new URL(req.url); } catch (e) { return; }

  // Audio e video usano lo streaming nativo e non vengono duplicati in Cache Storage.
  if (url.origin === self.location.origin && isStreamingMedia(req, url)) return;

  // 1) Tile della mappa
  if (isTileRequest(url)) {
    event.respondWith(tileStrategy(req));
    return;
  }

  // 2) CDN (Leaflet, FontAwesome, Google Fonts, ecc.)
  if (isCdnRequest(url)) {
    event.respondWith(staleWhileRevalidate(req, RUNTIME_CACHE));
    return;
  }

  // 3) Foto dei posti (cache on-demand)
  if (url.origin === self.location.origin && isPostiPhoto(url)) {
    event.respondWith(staleWhileRevalidate(req, RUNTIME_CACHE));
    return;
  }

  // 4) Tutto il resto: cache-first, fallback rete
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(req).then((cached) => cached || fetch(req).then((resp) => {
        // metti in cache anche le risorse locali appena viste
        if (resp && resp.status === 200) {
          const respClone = resp.clone();
          caches.open(SHELL_CACHE).then((c) => c.put(req, respClone)).catch(() => { });
        }
        return resp;
      }).catch(() => cached))
    );
    return;
  }

  // 5) Default: rete con fallback cache
  event.respondWith(fetch(req).catch(() => caches.match(req)));
});
