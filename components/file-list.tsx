"use client";

import { X, FileImage, CheckCircle2, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface ImageFile {
  id: string;
  file: File;
  preview: string;
  status: "pending" | "compressing" | "done" | "error";
  originalSize: number;
  compressedSize?: number;
  error?: string;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  if (isNaN(bytes) || !isFinite(bytes)) return "0 B";
  
  const isNegative = bytes < 0;
  const absBytes = Math.abs(bytes);
  
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(absBytes) / Math.log(k));
  const formatted = parseFloat((absBytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  
  return isNegative ? "-" + formatted : formatted;
}

function getSavingsPercent(original: number, compressed: number): number {
  return Math.round(((original - compressed) / original) * 100);
}

interface FileListProps {
  files: ImageFile[];
  onRemoveFile: (id: string) => void;
  isCompressing: boolean;
}

export function FileList({ files, onRemoveFile, isCompressing }: FileListProps) {
  if (files.length === 0) return null;

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 border-b border-border bg-secondary/30">
        <div className="flex items-center gap-2">
          <FileImage className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">
            {files.length} {files.length === 1 ? "image" : "images"} selected
          </span>
        </div>
        <span className="text-xs text-muted-foreground font-mono">
          {formatBytes(files.reduce((acc, f) => acc + f.originalSize, 0))} total
        </span>
      </div>

      <div className="divide-y divide-border max-h-[400px] overflow-y-auto">
        {files.map((file) => (
          <div
            key={file.id}
            className="flex items-center gap-4 px-5 py-3 hover:bg-secondary/20 transition-colors"
          >
            {/* Thumbnail */}
            <div className="relative h-10 w-10 rounded-lg overflow-hidden bg-secondary flex-shrink-0 border border-border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={file.preview}
                alt={file.file.name}
                className="h-full w-full object-cover"
              />
            </div>

            {/* File info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {file.file.name}
              </p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-muted-foreground font-mono">
                  {formatBytes(file.originalSize)}
                </span>
                {file.status === "done" && file.compressedSize !== undefined && (
                  <>
                    <span className="text-xs text-muted-foreground">{"-->"}</span>
                    <span className="text-xs text-primary font-mono font-medium">
                      {formatBytes(file.compressedSize)}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Status / Savings */}
            <div className="flex items-center gap-3 flex-shrink-0">
              {file.status === "pending" && (
                <Badge
                  variant="outline"
                  className="text-muted-foreground border-border text-xs"
                >
                  Ready
                </Badge>
              )}
              {file.status === "compressing" && (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                  <span className="text-xs text-muted-foreground">Compressing</span>
                </div>
              )}
              {file.status === "done" && file.compressedSize !== undefined && (
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/10 text-xs">
                    {"-"}{getSavingsPercent(file.originalSize, file.compressedSize)}%
                  </Badge>
                </div>
              )}
              {file.status === "error" && (
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-destructive" />
                  <span className="text-xs text-destructive">Failed</span>
                </div>
              )}

              {/* Remove button */}
              {!isCompressing && (
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "h-7 w-7 text-muted-foreground hover:text-foreground hover:bg-secondary",
                  )}
                  onClick={() => onRemoveFile(file.id)}
                  aria-label={`Remove ${file.file.name}`}
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export { formatBytes, getSavingsPercent };
