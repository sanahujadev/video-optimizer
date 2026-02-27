import fs from "fs-extra";
import { exec } from "child_process";
import { promisify } from "util";
import * as glob from "glob";

const run = promisify(exec);

const ASSETS_DIR = "./assets";
const OUTPUT_DIR = "./output";

async function processVideo(filePath) {
  const fileName = filePath.split("/").pop();
  const baseName = fileName.replace(/\.[^/.]+$/, "");
  const outDir = `${OUTPUT_DIR}/${baseName}`;

  await fs.ensureDir(outDir);

  console.log(`\n🔧 Procesando: ${fileName}`);

  try {
    // 1. Copiar original
    console.log("📹 Copiando video original...");
    await run(`ffmpeg -i "${filePath}" -c copy "${outDir}/video-original.mp4"`);

    // 2. WebM 480p
    console.log("📱 Generando versión 480p...");
    await run(
      `ffmpeg -i "${filePath}" -vf scale=-1:480 -c:v libvpx-vp9 -b:v 0 -crf 32 "${outDir}/video-480p.webm"` 
    );

    // 3. WebM 720p
    console.log("💻 Generando versión 720p...");
    await run(
      `ffmpeg -i "${filePath}" -vf scale=-1:720 -c:v libvpx-vp9 -b:v 0 -crf 30 "${outDir}/video-720p.webm"` 
    );

    // 4. WebM 1080p
    console.log("🖥️ Generando versión 1080p...");
    await run(
      `ffmpeg -i "${filePath}" -vf scale=-1:1080 -c:v libvpx-vp9 -b:v 0 -crf 28 "${outDir}/video-1080p.webm"` 
    );

    // 5. Poster AVIF
    console.log("🖼️ Generando placeholder AVIF...");
    await run(
      `ffmpeg -i "${filePath}" -vf "select=eq(n\\,0)" -vframes 1 "${outDir}/placeholder.avif"` 
      // `ffmpeg -i "${filePath}" -ss 00:00:19 -vframes 1 "${outDir}/placeholder.avif"` 
    );

    // 6. Metadata JSON
    const metadata = {
      original: `video-original.mp4`,
      outputs: [
        `video-480p.webm`,
        `video-720p.webm`,
        `video-1080p.webm` 
      ],
      poster: `placeholder.avif`,
      createdAt: new Date().toISOString()
    };

    await fs.writeJson(`${outDir}/metadata.json`, metadata, { spaces: 2 });

    console.log(`✅ Finalizado: ${fileName}`);
  } catch (error) {
    console.error(`❌ Error procesando ${fileName}:`, error.message);
    throw error;
  }
}

async function main() {
  console.log("🚀 Iniciando procesador de videos...");
  
  // Verificar si FFmpeg está instalado
  try {
    await run("ffmpeg -version");
    console.log("✅ FFmpeg detectado");
  } catch (error) {
    console.error("❌ FFmpeg no está instalado. Por favor, instálalo primero:");
    console.error("   - Ubuntu/Debian: sudo apt install ffmpeg");
    console.error("   - macOS: brew install ffmpeg");
    console.error("   - Windows: Descarga desde ffmpeg.org");
    process.exit(1);
  }

  const files = glob.sync(`${ASSETS_DIR}/*.{mp4,mov,mkv,avi,webm}`);

  if (files.length === 0) {
    console.log("📂 No hay videos en /assets");
    console.log("💡 Coloca tus videos en la carpeta 'assets' y ejecuta nuevamente");
    return;
  }

  console.log(`📹 Encontrados ${files.length} videos para procesar.`);

  for (const file of files) {
    await processVideo(file);
  }

  console.log("\n🎉 Todos los videos han sido procesados exitosamente.");
  console.log("📁 Los archivos optimizados están en la carpeta 'output'");
}

main().catch(console.error);
