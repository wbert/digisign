//@ts-nocheck
import { ReactNode, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Menu } from "lucide-react";
import { Link, Outlet } from "react-router";

type Props = { children: ReactNode };

export default function AppLayout({ children }: Props) {
  return (
    <div className="w-full min-h-dvh flex flex-col">
      <AppHeader />
      {/* page content */}
      <main className="w-full py-6 grow">
        <Outlet />
      </main>
      <Separator className="mt-2" />
      <AppFooter />
    </div>
  );
}

function AppHeader() {
  return (
    <header className="w-full border-b bg-background/80 backdrop-blur sticky top-0 z-40">
      <div className="w-full h-14 px-5  flex items-center justify-between">
        <a href="/" className="font-semibold tracking-tight text-lg">
          <img src="favicon.png" alt="digisign" className="h-8 w-8"></img>
        </a>

        {/* Center: Desktop nav */}
        <nav className="items-center">
          <div className="hidden md:flex gap-6">
            <Link className="text-sm hover:underline underline-offset-4" to="/">
              Home
            </Link>
            <Link
              className="text-sm hover:underline underline-offset-4"
              to="/features"
            >
              Features
            </Link>
            <Link
              className="text-sm hover:underline underline-offset-4"
              to="/about"
            >
              About
            </Link>
            <Link
              className="text-sm hover:underline underline-offset-4"
              to="/demo"
            >
              Demo
            </Link>
          </div>
          <InstallPWAButton />
          <MobileMenu />
        </nav>
      </div>
    </header>
  );
}

function MobileMenu() {
  return (
    <div className="md:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm" aria-label="Open menu">
            <Menu />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-64">
          <SheetHeader>
            <SheetTitle>
              <span className="text-sky-600">Digi</span> Sign
            </SheetTitle>
          </SheetHeader>
          <nav className="mt-4 flex flex-col gap-3 mx-3">
            <Link className="text-sm hover:underline underline-offset-4" to="/">
              Home
            </Link>
            <Link
              className="text-sm hover:underline underline-offset-4"
              to="/features"
            >
              Features
            </Link>
            <Link
              className="text-sm hover:underline underline-offset-4"
              to="/about"
            >
              About
            </Link>
            <Link
              className="text-sm hover:underline underline-offset-4"
              to="/demo"
            >
              Demo
            </Link>
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
}

function AppFooter() {
  return (
    <footer className="py-6">
      <div className="container mx-auto max-w-6xl px-4 text-sm text-muted-foreground gap-2 text-center items-center ">
        <div className="flex text-center justify-center">
          <p>© {new Date().getFullYear()} Digi Sign. All rights reserved.</p>
        </div>
        <div className="flex items-center text-center justify-center gap-4">
          <a className="hover:underline" href="/privacy">
            Privacy
          </a>
          <a className="hover:underline" href="/terms">
            Terms
          </a>
          <a
            className="hover:underline"
            href="https://github.com/"
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}

/**
 * Lightweight "Install App" button using the `beforeinstallprompt` event.
 * Shows only when the browser is installable and not already installed.
 */
function InstallPWAButton() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(
    null,
  );
  const [canInstall, setCanInstall] = useState(false);

  useEffect(() => {
    const onBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
      setCanInstall(true);
    };
    const onAppInstalled = () => setCanInstall(false);

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    window.addEventListener("appinstalled", onAppInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("appinstalled", onAppInstalled);
    };
  }, []);

  if (!canInstall || !deferred) return null;

  return (
    <Button
      size="sm"
      onClick={async () => {
        await deferred.prompt();
        // optional: check outcome
        const choice = await deferred.userChoice;
        // console.log(choice.outcome) // 'accepted' | 'dismissed'
        setDeferred(null);
        setCanInstall(false);
      }}
    >
      Install App
    </Button>
  );
}

// TS helper for the PWA event
declare global {
  interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
  }
}
