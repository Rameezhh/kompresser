"use client";

import { Shield, Zap, FileArchive, MonitorSmartphone, ImageIcon, Server } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Blazing Fast",
    description:
      "Powered by Kompressor. Compress dozens of images in seconds in your browser.",
  },
  {
    icon: Shield,
    title: "100% Private",
    description:
      "Your images never leave your session. Nothing is stored on our servers - everything is processed and returned instantly.",
  },
  {
    icon: FileArchive,
    title: "ZIP Download",
    description:
      "Compress multiple images and download them all at once as a single ZIP file. No need to download one by one.",
  },
  {
    icon: ImageIcon,
    title: "Multiple Formats",
    description:
      "Supports JPEG, PNG, WebP, AVIF, and TIFF. Each format is optimized with the best compression settings.",
  },
  {
    icon: MonitorSmartphone,
    title: "Works Everywhere",
    description:
      "Fully responsive design that works perfectly on desktop, tablet, and mobile. No app installation needed.",
  },
  {
    icon: Server,
    title: "No Limits",
    description:
      "Compress up to 50 images at once, with each image up to 50MB. Completely free with no signup required.",
  },
];

export function Features() {
  return (
    <section className="py-20 border-t border-border/50">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center mb-14">
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl text-balance">
            Why Kompressor?
          </h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto text-pretty">
            A purpose-built tool for fast, private, and effortless bulk image
            compression.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-xl border border-border bg-card p-6 transition-all duration-200 hover:border-primary/20 hover:bg-card/80"
            >
              <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-primary/10 border border-primary/20 mb-4 group-hover:bg-primary/15 transition-colors">
                <feature.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-base font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
