# Video Optimizer

Aplicación para optimizar videos para la web, generando múltiples resoluciones y formatos optimizados para CDN.

## 🚀 Características

- Convierte videos a múltiples resoluciones (480p, 720p, 1080p)
- Genera formato WebM con VP9 para mejor compresión
- Crea placeholder en formato AVIF
- Preserva el video original
- Genera metadata JSON para cada video
- Procesamiento por lotes de todos los videos en `/assets`

## 📦 Instalación

1. Instala las dependencias:
```bash
pnpm install
```

2. Asegúrate de tener FFmpeg instalado:
```bash
# Ubuntu/Debian
sudo apt install ffmpeg

# macOS
brew install ffmpeg

# Windows
# Descarga desde https://ffmpeg.org/download.html
```

## 🎬 Uso

1. Coloca tus videos en la carpeta `/assets`
2. Ejecuta el procesador:
```bash
pnpm start
```

## 📁 Estructura de salida

Para cada video `video.mp4` en `/assets`, se generará:

```
output/video/
├── video-original.mp4      # Video original copiado
├── video-480p.webm         # Versión 480p optimizada
├── video-720p.webm         # Versión 720p optimizada
├── video-1080p.webm        # Versión 1080p optimizada
├── placeholder.avif        # Poster/placeholder del video
└── metadata.json           # Metadatos del procesamiento
```

## 🌐 Implementación en frontend

```html
<video
  autoplay
  muted
  playsinline
  preload="metadata"
  poster="/cdn/video/placeholder.avif"
>
  <source src="/cdn/video/video-480p.webm" type="video/webm" media="(max-width: 600px)">
  <source src="/cdn/video/video-720p.webm" type="video/webm" media="(max-width: 1200px)">
  <source src="/cdn/video/video-1080p.webm" type="video/webm">
</video>
```

## 🎛️ Configuración

Puedes ajustar los parámetros de codificación en `scripts/process.js`:

- **CRF values**: Controla la calidad (menor = mejor calidad, mayor archivo)
  - 480p: 32
  - 720p: 30  
  - 1080p: 28

## 📋 Formatos soportados

- MP4
- MOV
- MKV
- AVI
- WebM

## 🔧 Requisitos

- Node.js 18+
- FFmpeg
- pnpm (recomendado)
