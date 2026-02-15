"use client";

import { ImageDown } from "lucide-react";

export function Header() {
  return (
    <header className="border-b border-border/50 bg-background/80 backdrop-blur-md sticky top-0 z-50">
      <div className="mx-auto max-w-6xl flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-primary/10 border border-primary/20">
            <ImageDown className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-semibold tracking-tight text-foreground">
              Kompressor
            </h1>
          </div>
        </div>
        <nav className="flex items-center gap-6">
          <span className="text-sm text-muted-foreground hidden sm:inline">
            Free bulk image compression
          </span>
          <a
            href="https://github.com/Rameezhh/kompresser"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            GitHub
          </a>
        </nav>
      </div>
    </header>
  );
}
