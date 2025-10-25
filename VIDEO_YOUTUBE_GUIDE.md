# Panduan Mengganti Video YouTube di Topik Pembelajaran

## Cara Mengubah Video YouTube Default

Video YouTube untuk setiap topik dapat diubah dengan dua cara:

### Cara 1: Mengubah Default Video (Hardcoded)

Edit file `components/pathway/topic-view.tsx` pada fungsi `getDefaultVideoId()`:

```typescript
function getDefaultVideoId(topicIndex: number): string {
  const defaultVideos = [
    'VIDEO_ID_1', // Topik 1 - ganti dengan video ID yang sesuai
    'VIDEO_ID_2', // Topik 2 - ganti dengan video ID yang sesuai
    'VIDEO_ID_3', // Topik 3 - ganti dengan video ID yang sesuai
    'VIDEO_ID_4', // Topik 4 - ganti dengan video ID yang sesuai
  ]
  return defaultVideos[topicIndex] || 'dQw4w9WgXcQ'
}
```

### Cara 2: Menambahkan videoUrl ke Database (Recommended)

Tambahkan field `videoUrl` ke dalam content JSON di database:

```json
{
  "sections": [
    {
      "title": "Pengenalan Ikatan Kimia",
      "content": "Konten pembelajaran...",
      "videoUrl": "https://www.youtube.com/embed/VIDEO_ID_DISINI"
    },
    {
      "title": "Jenis-jenis Ikatan",
      "content": "Konten pembelajaran...",
      "videoUrl": "https://www.youtube.com/embed/VIDEO_ID_LAINNYA"
    }
  ]
}
```

## Cara Mendapatkan Video ID dari YouTube

1. Buka video di YouTube
2. URL akan terlihat seperti: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
3. Video ID adalah bagian setelah `v=`, yaitu: `dQw4w9WgXcQ`
4. Atau untuk URL embed: `https://www.youtube.com/embed/dQw4w9WgXcQ`

## Contoh Video Edukasi Kimia di YouTube

Berikut beberapa channel YouTube yang menyediakan konten edukasi kimia:

- **Crash Course Chemistry**: Channel dengan video pembelajaran kimia berkualitas
- **Khan Academy**: Video pembelajaran kimia dari dasar
- **Tyler DeWitt**: Video kimia yang mudah dipahami
- **The Organic Chemistry Tutor**: Untuk topik kimia organik dan umum

### Contoh Video ID (Silakan cari video yang sesuai):

```typescript
const defaultVideos = [
  'XeLWe_SWI2M', // Contoh: Chemical Bonding Introduction
  'qR8A_pBsC7c', // Contoh: Ionic Bonds Explained
  'gEu-Sp5-Jw4', // Contoh: Covalent Bonds
  'R2kMdDdZgRc', // Contoh: Metallic Bonding
]
```

## Format Video yang Didukung

- YouTube Embedded Player (recommended)
- Responsive dengan aspect ratio 16:9
- Auto-detect untuk mobile dan desktop
- Mendukung fullscreen mode

## Fitur Video Player

✅ Autoplay disabled (user harus klik play)
✅ Fullscreen support
✅ Picture-in-picture mode
✅ Responsive design
✅ Loading optimization
