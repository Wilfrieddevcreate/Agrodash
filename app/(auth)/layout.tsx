import * as React from "react";
import Link from "next/link";
import { Logo } from "@/components/layout/logo";
import { MarketingPanel } from "@/components/auth/marketing-panel";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[color:var(--color-background)]">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
        {/* Left: form column */}
        <div className="relative flex min-h-screen flex-col bg-[color:var(--color-card)] px-6 py-10 sm:px-10 lg:px-14">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              aria-label="AgroDash home"
              className="inline-flex rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-ring)]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-background)]"
            >
              <Logo />
            </Link>
            <div className="text-xs text-[color:var(--color-muted-foreground)]">
              <Link
                href="/"
                className="rounded-md underline-offset-4 transition-colors hover:text-[color:var(--color-foreground)] hover:underline"
              >
                Back to site
              </Link>
            </div>
          </div>

          <main className="flex flex-1 items-center justify-center py-12">
            {children}
          </main>

          <footer className="flex flex-wrap items-center justify-between gap-3 text-xs text-[color:var(--color-muted-foreground)]">
            <span>&copy; {new Date().getFullYear()} AgroDash, Inc.</span>
            <nav className="flex items-center gap-4">
              <Link
                href="/"
                className="transition-colors hover:text-[color:var(--color-foreground)]"
              >
                Terms
              </Link>
              <Link
                href="/"
                className="transition-colors hover:text-[color:var(--color-foreground)]"
              >
                Privacy
              </Link>
              <Link
                href="/"
                className="transition-colors hover:text-[color:var(--color-foreground)]"
              >
                Support
              </Link>
            </nav>
          </footer>
        </div>

        {/* Right: premium marketing panel (lg+ only) */}
        <MarketingPanel />
      </div>
    </div>
  );
}
