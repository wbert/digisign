import { Button } from "@/components/ui/button";
import { ShieldCheck, FileSignature, Zap, Lock } from "lucide-react";
import { useNavigate } from "react-router";

export default function Hero() {
  const navigator = useNavigate();
  return (
    <section className="mx-5 flex flex-col items-center text-center py-16 sm:py-24">
      <img
        src="favicon.png"
        alt="digisign"
        className="h-32 w-32 justify-center text-center mb-3"
      ></img>
      <div className="max-w-3xl">
        <span className="inline-flex items-center rounded-full border px-3 py-1 text-xs sm:text-sm text-muted-foreground">
          PWA • shadcn/ui • PDF Signatures
        </span>

        <h1 className="mt-4 text-4xl sm:text-5xl font-bold tracking-tight">
          Digitally Sign PDFs—
          <span className="text-primary">Right in the Metadata</span>
        </h1>

        <p className="mt-4 text-muted-foreground">
          <strong>Digi Sign</strong> embeds and serializes verifiable digital
          signatures directly into a PDF’s metadata—no print/scan rituals, no
          watermark hacks. Fast, standards-friendly, and audit-ready.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            size="lg"
            className="px-6"
            onClick={() => navigator("/features")}
          >
            Get Started
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="px-6"
            onClick={() => navigator("/demo")}
          >
            Try a Demo PDF
          </Button>
        </div>

        <dl className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
          <div className="flex items-start gap-3 rounded-2xl border p-4">
            <FileSignature className="h-5 w-5 mt-1 text-primary" />
            <div>
              <dt className="font-semibold">Native PDF Metadata</dt>
              <dd className="text-sm text-muted-foreground">
                Embed signature hashes, issuer info, and timestamps into XMP
                fields.
              </dd>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-2xl border p-4">
            <Lock className="h-5 w-5 mt-1 text-primary" />
            <div>
              <dt className="font-semibold">PKCS#12 / X.509</dt>
              <dd className="text-sm text-muted-foreground">
                Use your .p12 certificates to sign and verify with confidence.
              </dd>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-2xl border p-4">
            <Zap className="h-5 w-5 mt-1 text-primary" />
            <div>
              <dt className="font-semibold">One-Click Workflow</dt>
              <dd className="text-sm text-muted-foreground">
                Upload → Sign → Download. Seamless in the browser as a PWA.
              </dd>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-2xl border p-4">
            <ShieldCheck className="h-5 w-5 mt-1 text-primary" />
            <div>
              <dt className="font-semibold">Audit-Ready Trails</dt>
              <dd className="text-sm text-muted-foreground">
                Serialized metadata keeps a verifiable record of who signed and
                when.
              </dd>
            </div>
          </div>
        </dl>

        <p className="mt-8 text-xs text-muted-foreground">
          Works offline as a PWA. No documents leave your device unless you
          choose to sync.
        </p>
      </div>
    </section>
  );
}
