import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import FeatureCard from "./feature-card";
import ModeCard from "./model-card";
import MetricCard from "./metric-card";
import DiffCard from "./diff-card";

export default function FeaturesPage() {
  return (
    <div className="w-full">
      {/* CONTAINER */}
      <div className="container mx-auto max-w-6xl px-4 py-12">
        {/* HERO */}
        <div className="justify-center text-center">
          <img
            src="favicon.png"
            alt="digisign"
            className="h-32 w-32 mx-auto mb-3"
          ></img>
        </div>{" "}
        <section className="mb-10 text-center">
          <h1 className="text-4xl font-semibold tracking-tight">
            Digi Sign — Features
          </h1>
          <p className="mt-3 text-muted-foreground max-w-3xl mx-auto">
            A precise, OCR‑aware PDF signing service powered by{" "}
            <code>pdfminer</code> (text/coordinates) and <code>endesive</code>{" "}
            (cryptographic signing), using a password‑protected PKCS#12
            (.p12/.pfx) credential.
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            <Badge>PKCS#12 / PFX</Badge>
            <Badge variant="secondary">OCR‑aware</Badge>
            <Badge variant="secondary">Visible Signature</Badge>
            <Badge variant="secondary">Batch Mode</Badge>
          </div>
        </section>
        <Separator className="my-8" />
        {/* CORE FEATURES GRID */}
        <section>
          <h2 className="text-2xl font-semibold tracking-tight mb-4">
            Core capabilities
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              title="OCR‑aware targeting"
              points={[
                "Parses text + coordinates via pdfminer",
                "Targets specific word occurrences",
                "Supports last‑match and per‑page rules",
              ]}
            />
            <FeatureCard
              title="Standards‑verifiable signing"
              points={[
                "PKCS#12 private key + certificate chain",
                "SHA‑256 digest recommended",
                "Verifies in common PDF readers",
              ]}
            />
            <FeatureCard
              title="Visible signature rendering"
              points={[
                "Transparent PNG overlay",
                "Auto scale/fit to target rectangle",
                "Consistent appearance per page",
              ]}
            />
            <FeatureCard
              title="Flexible placement rules"
              points={[
                "Last occurrence on last page",
                "Last occurrence per page",
                "Custom matchers extensible",
              ]}
            />
            <FeatureCard
              title="Batch processing"
              points={[
                "Sign multiple PDFs in one call",
                "Shared or per‑file search rules",
                "Deterministic output ordering",
              ]}
            />
            <FeatureCard
              title="Deterministic results"
              points={[
                "Explicit page coordinate math",
                "Stable placement across runs",
                "Traceable logs (optional)",
              ]}
            />
          </div>
        </section>
        {/* SIGNING MODES */}
        <section className="mt-12">
          <h2 className="text-2xl font-semibold tracking-tight mb-4">
            Signing modes
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            <ModeCard
              name="single_sign"
              tagline="Last occurrence • last page"
              bullets={[
                "Ideal for signing near a fixed footer or declaration block",
                "Quick and simple for one‑off documents",
              ]}
            />
            <ModeCard
              name="per_page_sign"
              tagline="Last occurrence • each page"
              bullets={[
                "Places a visible signature on every page",
                "Useful for page‑wise approvals or initials",
              ]}
            />
            <ModeCard
              name="multiple_sign"
              tagline="Batch of PDFs"
              bullets={[
                "Processes an array of PDF paths",
                "Same targeting rules as single_sign",
              ]}
            />
          </div>
        </section>
        {/* WHAT MAKES IT DIFFERENT */}
        <section className="mt-12">
          <h2 className="text-2xl font-semibold tracking-tight mb-4">
            What makes it different
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            <DiffCard
              title="Precision first"
              desc="Coordinates are derived from actual text runs, not naive image detection, yielding reliable placement even on dense layouts."
            />
            <DiffCard
              title="Composability"
              desc="Architecture separates extraction, locating, rendering, and signing — easy to extend/replace rules or appearance without touching crypto."
            />
            <DiffCard
              title="Verification‑ready"
              desc="Produces a standards‑verifiable artifact (cert chain embedded) that works in mainstream PDF readers and enterprise workflows."
            />
          </div>
        </section>
        {/* COMPATIBILITY & INPUT ASSUMPTIONS */}
        <section className="mt-12 grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Compatibility</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  Verifiable in Adobe Acrobat/Reader, Chrome, Okular, and
                  similar PDF viewers.
                </li>
                <li>
                  Works with OCR’d PDFs where text is extractable (not
                  image‑only).
                </li>
                <li>
                  Supports PKCS#12 (.p12/.pfx) containers with
                  password‑protected private keys.
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Input assumptions</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <ul className="list-disc pl-5 space-y-1">
                <li>Signature image is PNG with transparent background.</li>
                <li>
                  Search term(s) uniquely identify target locations or clear
                  last‑occurrence rules are acceptable.
                </li>
                <li>
                  Complex PDFs (rotations/forms) are supported within extractor
                  limits; results remain deterministic.
                </li>
              </ul>
            </CardContent>
          </Card>
        </section>
        {/* QUALITY SIGNALS */}
        <section className="mt-12">
          <h2 className="text-2xl font-semibold tracking-tight mb-4">
            Quality signals
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            <MetricCard
              title="Deterministic placement"
              desc="Same input ⇒ same signature rectangle every run."
            />
            <MetricCard
              title="Reader verification"
              desc="Signed PDFs pass built‑in validation in common viewers."
            />
            <MetricCard
              title="Batch throughput"
              desc="Process multiple documents in a single call."
            />
          </div>
        </section>
        <Separator className="my-12" />
        {/* CTA NOTE */}
        <Alert>
          <AlertTitle>Shipped features, evolving surface</AlertTitle>
          <AlertDescription className="text-sm">
            Need custom matchers (e.g., regex across lines), TSA timestamping,
            or signature appearance templates? The pipeline is designed to
            extend without breaking existing flows.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}
