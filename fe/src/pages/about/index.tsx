//@ts-nocheck
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Arrow from "./arrow";
import Box from "./box.tsx";

export default function ArchitecturePage() {
  return (
    <div className="w-full">
      <div className="container mx-auto max-w-5xl px-4 py-10">
        {/* PAGE HEADER */}
        <header className="mb-6">
          <h1 className="text-3xl font-semibold tracking-tight">
            PKCS12 Digital Signature — System Architecture & Execution
          </h1>
          <p className="text-muted-foreground mt-2">
            How the service locates targets in PDFs and produces a
            standards-verifiable signed document using <code>pdfminer</code> and{" "}
            <code>endesive</code> with a PKCS#12 (PFX) credential.
          </p>
        </header>

        <Separator className="my-6" />

        {/* OVERVIEW (what/why in one paragraph) */}
        <section className="space-y-3">
          <h2 className="text-xl font-semibold">Overview</h2>
          <p className="text-sm leading-relaxed">
            The system takes an OCR’d PDF, a transparent PNG signature image,
            and a PKCS#12 (.p12/.pfx) file (private key + certificate chain). It
            extracts text + coordinates from the PDF, determines the target
            placement for a visible signature, and signs the document
            cryptographically so PDF readers can verify authenticity.
          </p>
          <div className="flex gap-2 flex-wrap">
            <Badge variant="secondary">OCR’d PDF</Badge>
            <Badge variant="secondary">pdfminer</Badge>
            <Badge variant="secondary">endesive</Badge>
            <Badge>PKCS#12 / PFX</Badge>
          </div>
        </section>

        {/* ARCHITECTURE BLOCKS */}
        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-3">Architecture Blocks</h2>
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center text-sm">
                <Box
                  title="Inputs"
                  lines={[
                    "• OCR’d PDF",
                    "• Signature PNG (transparent)",
                    "• PFX (.p12) + password",
                    "• Search term(s) / rules",
                  ]}
                />

                <Arrow />

                <Box
                  title="Extraction (pdfminer)"
                  lines={[
                    "• Parse pages",
                    "• Extract text runs",
                    "• Capture bounding boxes (x, y, w, h)",
                  ]}
                />

                <Arrow />

                <Box
                  title="Locator"
                  lines={[
                    "• Match rule (last occurrence / per-page)",
                    "• Compute target rectangle",
                    "• Scale & position PNG",
                  ]}
                />

                <Arrow />

                <Box
                  title="Signer (endesive)"
                  lines={[
                    "• Build signature dict",
                    "• Hash & sign with PFX key",
                    "• Embed certificates",
                    "• Produce signed PDF",
                  ]}
                />

                <Arrow />

                <Box
                  title="Outputs"
                  lines={[
                    "• Signed PDF",
                    "• Placement metadata (optional)",
                    "• Verification-ready artifact",
                  ]}
                />
              </div>
            </CardContent>
          </Card>
        </section>

        {/* EXECUTION FLOW (step-by-step) */}
        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-3">Execution Flow</h2>
          <ol className="text-sm grid gap-3">
            <li>
              <b>Load Inputs.</b> Receive OCR’d PDF bytes/paths, PNG signature,
              and PFX (with password) plus the search rule (e.g., “last
              occurrence on last page” or “last on each page”).
            </li>
            <li>
              <b>Extract Text & Coordinates.</b> Use <code>pdfminer</code> to
              iterate each page, collecting text content and bounding boxes for
              runs/words.
            </li>
            <li>
              <b>Locate Target(s).</b> Apply the matching rule on extracted text
              to find the intended occurrence(s); compute placement rectangles
              in page coordinates.
            </li>
            <li>
              <b>Prepare Appearance.</b> Fit/scale the transparent PNG to the
              target rectangle; prepare the visible signature appearance
              dictionary.
            </li>
            <li>
              <b>Sign & Serialize.</b> With <code>endesive</code>, build the
              signature structure, sign the document’s byte range using the PFX
              private key, embed the certificate chain, and serialize the final
              signed PDF.
            </li>
            <li>
              <b>Return Artifact.</b> Emit the signed PDF (and optional
              placement/trace info) for verification in standard PDF readers.
            </li>
          </ol>
        </section>

        {/* ASSUMPTIONS / CONSTRAINTS — architecture-relevant only */}
        <section className="mt-8">
          <h2 className="text-xl font-semibold mb-3">
            Assumptions & Constraints
          </h2>
          <ul className="text-sm list-disc pl-5 space-y-2">
            <li>PDF must be OCR’d so text and coordinates are extractable.</li>
            <li>
              Signature image is PNG with transparent background for clean
              overlay.
            </li>
            <li>
              PKCS#12 includes the private key and corresponding certificate
              chain (password-protected).
            </li>
            <li>
              Placement rules are deterministic (e.g., “last occurrence”) to
              avoid ambiguity.
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
