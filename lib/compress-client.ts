/**
 * Client-side image compression using Canvas API.
 * NO server calls, NO body size limits.
 * Works with any file size up to browser memory limits.
 */

export interface CompressResult {
  blob: Blob;
  originalSize: number;
  compressedSize: number;
  outputName: string;
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${file.name}`));
    img.src = URL.createObjectURL(file);
  });
}

function getOutputMime(file: File): string {
  // Browser canvas supports jpeg, png, and webp
  const type = file.type.toLowerCase();
  if (type === "image/png") return "image/png";
  if (type === "image/webp") return "image/webp";
  // For everything else (jpeg, avif, tiff, bmp) -> jpeg
  return "image/jpeg";
}

function getOutputExtension(mime: string): string {
  switch (mime) {
    case "image/png": return ".png";
    case "image/webp": return ".webp";
    default: return ".jpg";
  }
}

function replaceExtension(filename: string, newExt: string): string {
  const lastDot = filename.lastIndexOf(".");
  if (lastDot === -1) return filename + newExt;
  return filename.substring(0, lastDot) + newExt;
}

function canvasToBlob(
  canvas: HTMLCanvasElement | OffscreenCanvas,
  mimeType: string,
  quality: number
): Promise<Blob> {
  if (canvas instanceof OffscreenCanvas) {
    return canvas.convertToBlob({ type: mimeType, quality });
  }
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Canvas toBlob returned null"));
      },
      mimeType,
      quality
    );
  });
}

/**
 * Compress a single image file using the browser's Canvas API.
 * - JPEG/AVIF/TIFF -> re-encoded as JPEG at reduced quality
 * - PNG -> converted to JPEG for better compression
 * - WebP -> re-encoded as WebP at reduced quality
 * - Large images (>4000px) are resized proportionally
 */
export async function compressImage(file: File): Promise<CompressResult> {
  const img = await loadImage(file);

  let { naturalWidth: w, naturalHeight: h } = img;

  // Downscale very large images to reduce output size
  const MAX_DIMENSION = 4096;
  if (w > MAX_DIMENSION || h > MAX_DIMENSION) {
    const ratio = Math.min(MAX_DIMENSION / w, MAX_DIMENSION / h);
    w = Math.round(w * ratio);
    h = Math.round(h * ratio);
  }

  const outputMime = getOutputMime(file);

  // Use OffscreenCanvas if available, otherwise regular canvas
  let canvas: HTMLCanvasElement | OffscreenCanvas;
  let ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D | null;

  if (typeof OffscreenCanvas !== "undefined") {
    canvas = new OffscreenCanvas(w, h);
    ctx = canvas.getContext("2d");
  } else {
    canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    ctx = canvas.getContext("2d");
  }

  if (!ctx) throw new Error("Could not get canvas context");

  // Draw with high-quality resampling
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(img, 0, 0, w, h);

  // Release the object URL
  URL.revokeObjectURL(img.src);

  // For PNG, we need to convert to JPEG for better compression
  // PNG in canvas doesn't compress well and often increases file size
  let quality = 0.85;
  let finalMime = outputMime;
  
  // For PNG files, convert to JPEG for much better compression
  if (outputMime === "image/png") {
    finalMime = "image/jpeg";
    quality = 0.85;
  } else if (outputMime === "image/webp") {
    quality = 0.85;
  } else {
    quality = 0.8;
  }
  
  let blob = await canvasToBlob(canvas, finalMime, quality);

  // If the output is still larger than original, reduce quality further
  if (blob.size >= file.size) {
    quality = 0.7;
    blob = await canvasToBlob(canvas, finalMime, quality);
  }

  // One more attempt at lower quality if still not smaller
  if (blob.size >= file.size) {
    quality = 0.55;
    blob = await canvasToBlob(canvas, finalMime, quality);
  }

  const ext = getOutputExtension(finalMime);
  const outputName = replaceExtension(file.name, ext);

  // Never return a larger file: if we couldn't compress, use original
  if (blob.size > file.size) {
    return {
      blob: file,
      originalSize: file.size,
      compressedSize: file.size,
      outputName: file.name,
    };
  }

  return {
    blob,
    originalSize: file.size,
    compressedSize: blob.size,
    outputName,
  };
}
