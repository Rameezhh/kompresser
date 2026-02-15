"use client";

import { ImageDown } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/50 py-10">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-2">
            <ImageDown className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-foreground">
              Kompressor
            </span>
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <span>Built with Next.js & Canvas API</span>
            <span className="h-1 w-1 rounded-full bg-muted-foreground/30" />
            <span>Free & Open Source</span>
          </div>
        </div>
        <div className="mt-6 text-center sm:text-left">
          <p className="text-xs text-muted-foreground/60">
            Your images are processed in memory and never stored. All data is
            discarded after compression is complete.
          </p>
        </div>
      </div>
    </footer>
  );
}
