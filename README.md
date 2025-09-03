# PWA Blog App

Sebuah aplikasi blog berbasis Progressive Web App (PWA) yang mirip Twitter, mendukung mode offline, autentikasi pengguna, dan fitur komentar. Dibangun menggunakan HTML, TailwindCSS, dan JavaScript murni, serta service worker untuk cache dan akses offline.

## Fitur
- Autentikasi pengguna (login/logout)
- Membuat, melihat, dan mengomentari postingan
- Dukungan offline melalui service worker dan cache lokal
- Prompt instalasi PWA untuk perangkat mobile/desktop
- UI responsif dengan TailwindCSS
- Penyimpanan data menggunakan API mock (JSON Server)

## Struktur Proyek
- `index.html`: UI utama dan logika aplikasi
- `manifest.json`: Manifest PWA (nama, ikon, tema, dll)
- `sw.js`: Service worker untuk cache dan sinkronisasi offline
- `db-test1.json`: Contoh database/mock untuk postingan, komentar, dan pengguna

## Cara Memulai

### 1. Instal JSON Server
Aplikasi ini membutuhkan REST API di `http://localhost:3000`. Anda dapat menggunakan [JSON Server](https://github.com/typicode/json-server) untuk mock API dengan `db-test1.json`.

```sh
npm install -g json-server
json-server --watch db-test1.json --port 3000
```

### 2. Menjalankan Aplikasi
Anda dapat menggunakan server statis seperti [live-server](https://www.npmjs.com/package/live-server):

```sh
npx live-server
```

Atau cukup buka `index.html` di browser Anda.

### 3. Kredensial Login
Pengguna uji:
- admin / admin
- john / passwordjohn
- jane / passwordjane

## Fitur PWA
- Prompt "Add to Home Screen"
- Akses offline untuk postingan/komentar

## Service Worker (`sw.js`)
- Cache aset statis dan respons API
- Menggunakan data yang telah disimpan secara lokal sebagai pengganti data yang biasanya diperoleh dari server
- Membersihkan cache lama saat aktivasi

## Manifest (`manifest.json`)
- Nama aplikasi, ikon, warna tema, dan mode tampilan
- Mendukung ikon maskable untuk instalasi PWA

## Data Contoh (`db-test1.json`)
- Postingan, komentar, dan pengguna untuk pengujian