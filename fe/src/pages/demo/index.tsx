import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { PageSpinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost/api";

type StoredPaths = {
  pdf_path?: string;
  pdf_image?: string;
  p12_signature?: string;
};

type SignResult = { signed_path?: string; message?: string } | null;

export default function DemoSignPage() {
  // Step 1: local file inputs
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [imgFile, setImgFile] = useState<File | null>(null);
  const [p12File, setP12File] = useState<File | null>(null);

  // Step 2: signing inputs
  const [password, setPassword] = useState("");
  const [searchWord, setSearchWord] = useState("");
  const [signType, setSignType] = useState("");

  // Server-provided file paths after upload
  const [paths, setPaths] = useState<StoredPaths>({});

  // UI state
  const [isUploading, setUploading] = useState(false);
  const [isSigning, setSigning] = useState(false);
  const [signResult, setSignResult] = useState<SignResult>(null);

  // Derived guards
  const hasPaths =
    Boolean(paths.pdf_path) &&
    Boolean(paths.pdf_image) &&
    Boolean(paths.p12_signature);

  const canUpload = useMemo(
    () => Boolean(pdfFile && imgFile && p12File),
    [pdfFile, imgFile, p12File],
  );

  const canSign = useMemo(
    () => hasPaths && Boolean(password) && Boolean(searchWord),
    [hasPaths, password, searchWord],
  );

  // --- Actions ----------------------------------------------------

  const onUpload = async () => {
    if (!canUpload) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("pdf_path", pdfFile as File);
      fd.append("pdf_image", imgFile as File);
      fd.append("p12_signature", p12File as File);

      const res = await fetch(`${API_BASE}/files/store`, {
        method: "POST",
        body: fd,
      });
      if (!res.ok) throw new Error(`Upload failed: ${res.status}`);

      const json = await res.json();
      const next = json.paths || json;
      setPaths({
        pdf_path: next.pdf_path,
        pdf_image: next.pdf_image,
        p12_signature: next.p12_signature,
      });
      toast.success("Files uploaded. Server returned normalized paths.");
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message ?? "Failed to upload.");
    } finally {
      setUploading(false);
    }
  };

  const onSign = async () => {
    if (!canSign) return;
    setSigning(true);
    setSignResult(null);
    try {
      const payload = {
        sign_type: signType,
        pdf_image: paths.pdf_image,
        p12_signature: paths.p12_signature,
        pdf_path: paths.pdf_path,
        password,
        search_word: searchWord,
      };

      const res = await fetch(`${API_BASE}/sign/sign`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`Sign failed: ${res.status}`);

      const ct = res.headers.get("content-type") || "";
      if (ct.includes("application/json")) {
        const json = await res.json();
        setSignResult(json);
        toast.success(
          json?.signed_path ? "Signed PDF is ready." : "Signing finished.",
        );
      } else {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        setSignResult({ signed_path: url });
        toast.success("Signed PDF received as a file.");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message ?? "Failed to sign.");
    } finally {
      setSigning(false);
    }
  };

  const onReset = () => {
    setPdfFile(null);
    setImgFile(null);
    setP12File(null);
    setPaths({});
    setPassword("");
    setSearchWord("");
    setSignResult(null);
  };

  // --- UI ---------------------------------------------------------

  return (
    <div className="w-full">
      <div className="container mx-auto max-w-5xl px-4 py-10">
        <header className="mb-6">
          <h1 className="text-3xl font-semibold tracking-tight">
            PKCS12 Signing Demo
          </h1>
          <p className="text-muted-foreground mt-2">
            1) Upload files → 2) Wait for server → 3) Enter password & target →
            4) Sign.
          </p>
        </header>

        <Separator className="my-6" />

        {/* Step 1: Upload */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Step 1 — Upload source files</CardTitle>

              <Badge variant={hasPaths ? "default" : "secondary"}>
                {hasPaths ? "Uploaded" : "Waiting for upload"}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="pdf">PDF (OCR'd)</Label>
              <Input
                id="pdf"
                type="file"
                accept="application/pdf"
                onChange={(e) => setPdfFile(e.target.files?.[0] ?? null)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="img">Signature PNG (transparent)</Label>
              <Input
                id="img"
                type="file"
                accept="image/png"
                onChange={(e) => setImgFile(e.target.files?.[0] ?? null)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="p12">PKCS#12 (.p12/.pfx)</Label>
              <Input
                id="p12"
                type="file"
                accept=".p12,.pfx,application/x-pkcs12"
                onChange={(e) => setP12File(e.target.files?.[0] ?? null)}
              />
            </div>

            <div className="flex items-end gap-3">
              <Button disabled={!canUpload || isUploading} onClick={onUpload}>
                               {" "}
                {isUploading ? (
                  <>
                                       {" "}
                    <PageSpinner className="mr-2 h-4 w-4 animate-spin" />       
                                Uploading…                  {" "}
                  </>
                ) : (
                  "Upload"
                )}
                             {" "}
              </Button>{" "}
              <Button variant="ghost" onClick={onReset}>
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Step 2: Sign (only visible after upload paths exist) */}
        {hasPaths && (
          <Card className="mt-8">
            <CardHeader>
              {/* FIX: Wrap title and badge in a flex container */}
              <div className="flex items-center justify-between">
                <CardTitle>Step 2 — Sign</CardTitle>

                {/* BADGE MOVED HERE */}
                <Badge variant={!canSign ? "secondary" : "default"}>
                  {canSign ? "Ready" : "Waiting for inputs"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              {/* ... your input fields ... */}
              <div className="space-y-2">
                <Label htmlFor="password">PFX Password</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="search">Target word / phrase</Label>
                <Input
                  id="search"
                  type="text"
                  placeholder="e.g. ADMIN H. USERNAME"
                  value={searchWord}
                  onChange={(e) => setSearchWord(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signType">Sign Type</Label>
                <Select
                  value={signType}
                  onValueChange={(value) => setSignType(value)}
                >
                  <SelectTrigger id="signType" className="w-full">
                    <SelectValue placeholder="Choose sign type..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single_sign">Single Sign</SelectItem>
                    <SelectItem value="per_page_sign">Per Page Sign</SelectItem>
                    <SelectItem value="per_name_sign">Per Name Sign</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* CLEANUP: The button group now only contains the action button */}
              <div className="flex items-end gap-3">
                <Button disabled={!canSign || isSigning} onClick={onSign}>
                                   {" "}
                  {isSigning ? (
                    <>
                                           {" "}
                      <PageSpinner className="mr-2 h-4 w-4 animate-spin" />     
                                      Signing…                    {" "}
                    </>
                  ) : (
                    "Sign PDF"
                  )}
                                 {" "}
                </Button>
                {/* BADGE REMOVED FROM HERE */}
              </div>
            </CardContent>
          </Card>
        )}
        {/* Result */}
        {signResult && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Result</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {signResult.message && <p>{signResult.message}</p>}
              {signResult.signed_path && (
                <a
                  className="underline"
                  href={signResult.signed_path}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open signed PDF
                </a>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
