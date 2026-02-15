"use client";

import { useState, useCallback } from "react";
import { Download, Trash2, ImageDown, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Dropzone } from "./dropzone";
import { FileList, type ImageFile } from "./file-list";
import { CompressionStats } from "./compression-stats";
import { compressImage } from "@/lib/compress-client";

let fileCounter = 0;

export function ImageCompressor() {
  const [files, setFiles] = useState<ImageFile[]>([]);
  const [isCompressing, setIsCompressing] = useState(false);
  const [compressionDone, setCompressionDone] = useState(false);
  const [compressedBlobs, setCompressedBlobs] = useState<
    { blob: Blob; name: string }[]
  >([]);
  const [progress, setProgress] = useState(0);

  const handleFilesAdded = useCallback(
    (newFiles: File[]) => {
      const currentCount = files.length;
      const remaining = 50 - currentCount;

      if (remaining <= 0) {
        toast.error("Maximum 50 files allowed");
        return;
      }

      const filesToAdd = newFiles.slice(0, remaining);
      if (filesToAdd.length < newFiles.length) {
        toast.warning(
          `Only ${filesToAdd.length} of ${newFiles.length} files added (max 50)`
        );
      }

      const imageFiles: ImageFile[] = filesToAdd.map((file) => ({
        id: `file-${++fileCounter}`,
        file,
        preview: URL.createObjectURL(file),
        status: "pending" as const,
        originalSize: file.size,
      }));

      setFiles((prev) => [...prev, ...imageFiles]);
      setCompressionDone(false);
      setCompressedBlobs([]);
    },
    [files.length]
  );

  const handleRemoveFile = useCallback((id: string) => {
    setFiles((prev) => {
      const file = prev.find((f) => f.id === id);
      if (file) URL.revokeObjectURL(file.preview);
      return prev.filter((f) => f.id !== id);
    });
    setCompressionDone(false);
    setCompressedBlobs([]);
  }, []);

  const handleClearAll = useCallback(() => {
    files.forEach((f) => URL.revokeObjectURL(f.preview));
    setFiles([]);
    setCompressionDone(false);
    setCompressedBlobs([]);
  }, [files]);

  const handleCompress = useCallback(async () => {
    if (files.length === 0) return;

    setIsCompressing(true);
    setProgress(0);
    setCompressionDone(false);
    setCompressedBlobs([]);

    // Mark all as compressing
    setFiles((prev) =>
      prev.map((f) => ({ ...f, status: "compressing" as const }))
    );

    const results: { blob: Blob; name: string }[] = [];
    let hasErrors = false;

    for (let i = 0; i < files.length; i++) {
      const imageFile = files[i];
      try {
        // All compression happens in the browser - no server call
        const result = await compressImage(imageFile.file);

        results.push({ blob: result.blob, name: result.outputName });

        // Update this file to done
        setFiles((prev) =>
          prev.map((f) =>
            f.id === imageFile.id
              ? {
                  ...f,
                  status: "done" as const,
                  compressedSize: result.compressedSize,
                }
              : f
          )
        );
      } catch (error) {
        hasErrors = true;
        const message =
          error instanceof Error ? error.message : "Compression failed";

        setFiles((prev) =>
          prev.map((f) =>
            f.id === imageFile.id
              ? { ...f, status: "error" as const, error: message }
              : f
          )
        );
      }

      // Update progress
      setProgress(Math.round(((i + 1) / files.length) * 100));

      // Small yield so the UI can repaint between files
      await new Promise((r) => setTimeout(r, 10));
    }

    if (results.length > 0) {
      setCompressedBlobs(results);
      setCompressionDone(true);
      if (hasErrors) {
        toast.warning(
          `${results.length} of ${files.length} images compressed. Some failed.`
        );
      } else {
        toast.success("All images compressed successfully!");
      }
    } else {
      toast.error("All compressions failed. Please try again.");
    }

    setIsCompressing(false);
  }, [files]);

  const handleDownload = useCallback(async () => {
    if (compressedBlobs.length === 0) return;

    if (compressedBlobs.length === 1) {
      // Single file download
      const { blob, name } = compressedBlobs[0];
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      return;
    }

    // Multiple files - create ZIP on client
    toast.info("Creating ZIP file...");
    const JSZip = (await import("jszip")).default;
    const { saveAs } = await import("file-saver");

    const zip = new JSZip();
    for (const { blob, name } of compressedBlobs) {
      zip.file(name, blob);
    }

    const zipBlob = await zip.generateAsync({ type: "blob" });
    saveAs(zipBlob, "compressed-images.zip");
  }, [compressedBlobs]);

  const totalOriginal = files.reduce((acc, f) => acc + f.originalSize, 0);
  const totalCompressed = files.reduce(
    (acc, f) => acc + (f.compressedSize ?? f.originalSize),
    0
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Dropzone */}
      <Dropzone onFilesAdded={handleFilesAdded} disabled={isCompressing} />

      {/* File List */}
      <FileList
        files={files}
        onRemoveFile={handleRemoveFile}
        isCompressing={isCompressing}
      />

      {/* Progress Bar */}
      {isCompressing && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Compressing... (
              {Math.round((progress / 100) * files.length)}/{files.length})
            </span>
            <span className="text-sm font-mono text-foreground">
              {progress}%
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )}

      {/* Stats */}
      {compressionDone && (
        <CompressionStats
          totalOriginal={totalOriginal}
          totalCompressed={totalCompressed}
          fileCount={files.filter((f) => f.status === "done").length}
        />
      )}

      {/* Action Buttons */}
      {files.length > 0 && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearAll}
              disabled={isCompressing}
              className="border-border text-muted-foreground hover:text-foreground"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          </div>

          <div className="flex items-center gap-3">
            {compressionDone && compressedBlobs.length > 0 && (
              <Button
                onClick={handleDownload}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Download className="h-4 w-4 mr-2" />
                {compressedBlobs.length === 1
                  ? "Download Image"
                  : "Download ZIP"}
              </Button>
            )}

            {!compressionDone && (
              <Button
                onClick={handleCompress}
                disabled={isCompressing || files.length === 0}
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {isCompressing ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <ImageDown className="h-4 w-4 mr-2" />
                )}
                {isCompressing
                  ? "Compressing..."
                  : `Compress ${files.length} ${files.length === 1 ? "Image" : "Images"}`}
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
