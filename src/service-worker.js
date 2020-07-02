var CACHE_NAME = `catfactz-${__buildDate__}`;
var urlsToCache = [
  "/",
  "/favicon.png",
  "/global.css",
  "/build/bundle.css",
  "/build/bundle.js",
];

urlsToCache = urlsToCache.map((url) => `${__BASE_DIR__}${url}`);

function clearUnusedCaches(temporary) {
  return caches.keys().then(async (keys) => {
    for (const key of keys) {
      if (!temporary && key.startsWith("temporary-")) {
        continue;
      }

      if (key !== CACHE_NAME) {
        await caches.delete(key);

        if (__dev__) {
          console.log(`Cleared cache ${key}`);
        }
      }
    }
  });
}

async function createCache() {
  const cache = await caches.open(CACHE_NAME);

  print(`Opened cache ${CACHE_NAME}`);

  return cache.addAll(urlsToCache);
}

self.addEventListener("activate", (ev) => {
  print(`activate`);

  ev.waitUntil(clearUnusedCaches(true).then(() => self.clients.claim()));
});

self.addEventListener("install", (ev) => {
  print("install");

  ev.waitUntil(Promise.all([createCache(), clearUnusedCaches(false)]));
});

self.addEventListener("fetch", (event) => {
  print(`${event.request.method} ${event.request.url}`);
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  if (!url.protocol.startsWith("http")) {
    return;
  }

  if (url.host === self.location.host && urlsToCache.includes(url.pathname)) {
    event.respondWith(caches.match(event.request));
    return;
  }

  if (event.request.cache === "only-if-cached") {
    return;
  }

  const timestamp = new Date().toISOString();

  event.respondWith(
    caches.open(`offline-${timestamp}`).then(async (cache) => {
      try {
        const response = await fetch(event.request);
        cache.put(event.request, response.clone());
        return response;
      } catch (err) {
        const response = await cache.match(event.request);
        if (response) return response;

        throw err;
      }
    })
  );
});

function print(message) {
  if (__dev__) {
    console.log(
      `%cService-Worker%c ${message}`,
      "background:#eee;color:#333;padding:0.5em",
      ""
    );
  }
}
