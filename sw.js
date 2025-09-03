const CACHE_NAME = "pwa-blog-v1.2";
const API_CACHE = "api-cache-v1.2";
const urlsToCache = [
  "./",
  "./index.html",
  "./manifest.json",
  "https://cdn.tailwindcss.com/3.4.0",
  "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
];

// Instalasi event
self.addEventListener("install", (event) => {
  console.log("Service worker sedang diinstalasi...");
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("Cache dibuka, menambahkan URL...");
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log("Semua URL berhasil ditambahkan");
        // Paksa service worker yang sedang menunggu untuk menjadi service worker yang aktif
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error("Instalasi cache gagal:", error);
      })
  );
});

// Activate event
self.addEventListener("activate", (event) => {
  console.log("Service worker sedang diaktifkan...");
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME && cacheName !== API_CACHE) {
              console.log("Menghapus cache lama:", cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        // Ambil kendali atas semua klien segera
        return self.clients.claim();
      })
  );
});

// Fetch event - Strategi jaringan pertama, lalu cache
self.addEventListener("fetch", (event) => {
  if (
    event.request.url.includes("/posts") ||
    event.request.url.includes("/comments") ||
    event.request.url.includes("/users")
  ) {
    // Permintaan API - Jaringan pertama, cache fallback
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Clone respon sebelum caching
          const responseClone = response.clone();

          // Hanya cache permintaan GET yang berhasil
          if (event.request.method === "GET" && response.status === 200) {
            caches.open(API_CACHE).then((cache) => {
              cache.put(event.request, responseClone);
            });
          }

          return response;
        })
        .catch(() => {
          // Jaringan gagal, coba cache
          return caches.match(event.request).then((response) => {
            if (response) {
              return response;
            }
            // Kembalikan halaman offline atau respon error
            throw new Error("Jaringan dan cache gagal");
          });
        })
    );
  } else {
    // Aset statis - Cache pertama, jaringan fallback
    event.respondWith(
      caches.match(event.request).then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
    );
  }
});

// Handle sinkronisasi latar belakang untuk postingan/komentar offline
self.addEventListener("sync", (event) => {
  if (event.tag === "background-sync") {
    event.waitUntil(syncOfflineData());
  }
});

/**
 * Mendapatkan data offline yang perlu disinkronkan.
 * Fungsi ini mengembalikan promise yang berisi array data offline.
 * @returns {Promise<Array<Object>>} Data offline yang perlu disinkronkan
 */
async function getOfflineData() {
  // Untuk sederhana, fungsi ini mengembalikan array kosong
  // Dalam implementasi yang sebenarnya, fungsi ini akan mengembalikan data dari IndexedDB
  return [];
}

/**
 * Menghapus item offline yang sudah disinkronkan.
 * Fungsi ini mengembalikan promise yang diselesaikan setelah item dihapus dari IndexedDB.
 * @param {string} id ID item yang ingin dihapus
 */
async function removeOfflineItem(id) {
  // Untuk sederhana, fungsi ini tidak melakukan apapun
  // Dalam implementasi yang sebenarnya, fungsi ini akan menghapus data dari IndexedDB
  return;
}

/**
 * Menyinkronkan data offline yang perlu disinkronkan.
 * Fungsi ini mengembalikan promise yang diselesaikan setelah data offline disinkronkan.
 */
async function syncOfflineData() {
  try {
    const offlineData = await getOfflineData();

    for (const item of offlineData) {
      try {
        if (item.type === "post") {
          await fetch("http://localhost:3000/posts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(item.data),
          });
        } else if (item.type === "comment") {
          await fetch("http://localhost:3000/comments", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(item.data),
          });
        }
        // Hapus item yang berhasil disinkronkan
        await removeOfflineItem(item.id);
      } catch (error) {
        console.error("Gagal menyinkronkan item:", error);
      }
    }
  } catch (error) {
    console.error("Sinkronisasi latar belakang gagal:", error);
  }
}

/**
 * Mendapatkan data offline yang perlu disinkronkan.
 * Fungsi ini mengembalikan promise yang berisi array data offline.
 * @returns {Promise<Array<Object>>} Data offline yang perlu disinkronkan
 */
async function getOfflineData() {
  // Untuk sederhana, fungsi ini mengembalikan array kosong
  // Dalam implementasi yang sebenarnya, fungsi ini akan mengembalikan data dari IndexedDB
  return [];
}

/**
 * Menghapus item offline yang sudah disinkronkan.
 * Fungsi ini mengembalikan promise yang diselesaikan setelah item dihapus dari IndexedDB.
 * @param {string} id ID item yang ingin dihapus
 * @returns {Promise<void>} Promise yang diselesaikan setelah item dihapus
 */
async function removeOfflineItem(id) {
  // Remove item dari IndexedDB
  // Dalam implementasi yang sebenarnya, fungsi ini akan menghapus item dari IndexedDB
}
