"use client";

import { ArrowDown, Percent, FileStack, Zap } from "lucide-react";
import { formatBytes, getSavingsPercent } from "./file-list";

interface CompressionStatsProps {
  totalOriginal: number;
  totalCompressed: number;
  fileCount: number;
}

export function CompressionStats({
  totalOriginal,
  totalCompressed,
  fileCount,
}: CompressionStatsProps) {
  const savings = Math.max(0, totalOriginal - totalCompressed);
  const percent = Math.max(0, getSavingsPercent(totalOriginal, totalCompressed));

  return (
    <div className="rounded-xl border border-primary/20 bg-primary/5 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Zap className="h-5 w-5 text-primary" />
        <h3 className="text-sm font-semibold text-foreground">
          Compression Complete
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <FileStack className="h-3.5 w-3.5" />
            <span className="text-xs">Files</span>
          </div>
          <span className="text-xl font-bold font-mono text-foreground">
            {fileCount}
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <ArrowDown className="h-3.5 w-3.5" />
            <span className="text-xs">Saved</span>
          </div>
          <span className="text-xl font-bold font-mono text-primary">
            {formatBytes(savings)}
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Percent className="h-3.5 w-3.5" />
            <span className="text-xs">Reduction</span>
          </div>
          <span className="text-xl font-bold font-mono text-primary">
            {percent}%
          </span>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground">New Size</span>
          <span className="text-xl font-bold font-mono text-foreground">
            {formatBytes(totalCompressed)}
          </span>
        </div>
      </div>
    </div>
  );
}
