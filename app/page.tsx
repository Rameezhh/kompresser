import { Header } from "@/components/header";
import { ImageCompressor } from "@/components/image-compressor";
import { Features } from "@/components/features";
import { Footer } from "@/components/footer";

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 sm:py-24">
          <div className="mx-auto max-w-6xl px-6">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 mb-6">
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                <span className="text-xs font-medium text-primary">
                  Free - No signup required
                </span>
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl text-balance">
                Compress images
                <br />
                <span className="text-primary">in bulk, instantly</span>
              </h1>
              <p className="mt-5 text-lg text-muted-foreground max-w-2xl mx-auto text-pretty leading-relaxed">
                Drop your images below and get optimized files in seconds.
                Powered by Kompressor with support for JPEG, PNG, WebP, AVIF, and TIFF.
                Download all as a ZIP.
              </p>
            </div>

            {/* Compressor Tool */}
            <div className="max-w-3xl mx-auto">
              <ImageCompressor />
            </div>
          </div>
        </section>

        {/* Features */}
        <Features />
      </main>

      <Footer />
    </div>
  );
}
