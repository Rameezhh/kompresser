"use client";

import { useCallback, useState } from "react";
import { Upload, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB per image

const ACCEPTED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/tiff",

];

interface DropzoneProps {
  onFilesAdded: (files: File[]) => void;
  disabled?: boolean;
}

export function Dropzone({ onFilesAdded, disabled }: DropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (disabled) return;
      if (e.type === "dragenter" || e.type === "dragover") {
        setIsDragging(true);
      } else if (e.type === "dragleave") {
        setIsDragging(false);
      }
    },
    [disabled]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      if (disabled) return;

      const validFiles: File[] = [];
      const oversized: string[] = [];
      for (const file of Array.from(e.dataTransfer.files)) {
        if (!ACCEPTED_TYPES.includes(file.type)) continue;
        if (file.size > MAX_FILE_SIZE) {
          oversized.push(file.name);
          continue;
        }
        validFiles.push(file);
      }
      if (oversized.length > 0) {
        toast.error(`${oversized.length} file(s) skipped (over 50 MB): ${oversized.join(", ")}`);
      }
      if (validFiles.length > 0) {
        onFilesAdded(validFiles);
      }
    },
    [onFilesAdded, disabled]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (disabled) return;
      const validFiles: File[] = [];
      const oversized: string[] = [];
      for (const file of Array.from(e.target.files || [])) {
        if (!ACCEPTED_TYPES.includes(file.type)) continue;
        if (file.size > MAX_FILE_SIZE) {
          oversized.push(file.name);
          continue;
        }
        validFiles.push(file);
      }
      if (oversized.length > 0) {
        toast.error(`${oversized.length} file(s) skipped (over 50 MB): ${oversized.join(", ")}`);
      }
      if (validFiles.length > 0) {
        onFilesAdded(validFiles);
      }
      // Reset input so same files can be selected again
      e.target.value = "";
    },
    [onFilesAdded, disabled]
  );

  return (
    <div
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      className={cn(
        "relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-12 transition-all duration-200 cursor-pointer group",
        isDragging
          ? "border-primary bg-primary/5 scale-[1.01]"
          : "border-border hover:border-muted-foreground/40 hover:bg-card/50",
        disabled && "opacity-50 cursor-not-allowed pointer-events-none"
      )}
    >
      <input
        type="file"
        multiple
        accept={ACCEPTED_TYPES.join(",")}
        onChange={handleFileSelect}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        disabled={disabled}
        aria-label="Upload images"
      />

      <div
        className={cn(
          "flex items-center justify-center h-16 w-16 rounded-2xl mb-6 transition-all duration-200",
          isDragging
            ? "bg-primary/15 border border-primary/30"
            : "bg-secondary border border-border group-hover:border-muted-foreground/30"
        )}
      >
        {isDragging ? (
          <ImageIcon className="h-7 w-7 text-primary" />
        ) : (
          <Upload className="h-7 w-7 text-muted-foreground group-hover:text-foreground transition-colors" />
        )}
      </div>

      <p className="text-base font-medium text-foreground mb-2">
        {isDragging ? "Drop your images here" : "Drop images here or click to browse"}
      </p>
      <p className="text-sm text-muted-foreground mb-4">
        JPEG, PNG, WebP, AVIF, TIFF
      </p>
      <div className="flex items-center gap-4 text-xs text-muted-foreground/70">
        <span>Max 50MB per image</span>
        <span className="h-1 w-1 rounded-full bg-muted-foreground/30" />
        <span>Up to 50 files</span>
      </div>
    </div>
  );
}
