# Portfolio Surya Wardana

Website statis (HTML + CSS + JS biasa). Tidak perlu build, tidak perlu npm.

## Struktur

```
portfolio/
├── index.html              ← isi konten halaman (teks, section)
├── css/
│   ├── variables.css       ← warna & font (ubah tema di sini)
│   ├── base.css            ← reset & gaya dasar
│   ├── layout.css          ← header, navigasi, section, footer
│   ├── hero.css            ← bagian pembuka (globe, statistik)
│   └── components.css      ← tombol, kartu, timeline, chip, kontak
├── js/
│   ├── theme.js            ← mode gelap/terang
│   ├── nav.js              ← menu mobile & menu aktif
│   ├── copy-email.js       ← tombol salin email
│   ├── hero-fx.js          ← gerakan globe: ikon mengorbit, riak, partikel, komet
│   └── waves.js            ← gelombang cahaya listrik di dasar hero
└── assets/
    ├── logo.svg
    ├── hero-globe.png      ← gambar globe + dudukan (dari desain, tidak diubah)
    ├── icons/              ← ikon Python, React, Node.js, JavaScript, AI/ML
    ├── fotobaru.png        ← LETAKKAN foto Anda di sini
    └── CV_Surya_Wardana.pdf ← LETAKKAN CV Anda di sini (tanpa spasi)
```

## Cara menjalankan

- Klik kanan `index.html` di VS Code → **Open with Live Server**, atau
- buka `index.html` langsung di browser.

## Deploy ke GitHub Pages

Upload seluruh isi folder `portfolio/` ke repository, lalu aktifkan
Settings → Pages → Branch `main` / root.
