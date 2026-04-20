"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";
import { useT } from "@/components/providers/language-provider";

/**
 * Top-level (root) error boundary. Rendered when anything below the root
 * layout throws.
 *
 * Next 16 provides `unstable_retry` as the preferred recovery hook and
 * keeps the older `reset` available; we accept both so the page stays
 * forward- and backward-compatible.
 */
export default function GlobalError({
  error,
  reset,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  reset?: () => void;
  unstable_retry?: () => void;
}) {
  const t = useT();

  React.useEffect(() => {
    // eslint-disable-next-line no-console
    console.error("[AgroDash] top-level error:", error);
  }, [error]);

  const retry = React.useCallback(() => {
    if (unstable_retry) return unstable_retry();
    if (reset) return reset();
  }, [unstable_retry, reset]);

  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden bg-[color:var(--color-background)] px-6 py-10">
      {/* Mesh backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60 [mask-image:radial-gradient(circle_at_center,black,transparent_70%)]"
        style={{
          backgroundImage:
            "linear-gradient(to right, color-mix(in oklab, var(--color-border) 55%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in oklab, var(--color-border) 55%, transparent) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-64 w-[min(720px,90vw)] -translate-x-1/2 rounded-full bg-[color:var(--color-destructive)]/15 blur-3xl"
      />

      <div className="relative z-10 w-full max-w-lg text-center">
        <div className="mx-auto mb-8 w-fit">
          <Logo />
        </div>

        {/* Broken leaf illustration */}
        <div className="relative mx-auto mb-6 flex size-24 items-center justify-center rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-card)] shadow-elev-md">
          <svg
            viewBox="0 0 64 64"
            className="size-12"
            fill="none"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="leafGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="var(--color-destructive)" />
                <stop
                  offset="100%"
                  stopColor="var(--color-primary)"
                  stopOpacity="0.65"
                />
              </linearGradient>
            </defs>
            {/* Stem */}
            <path
              d="M32 54V32"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
              className="text-[color:var(--color-muted-foreground)]"
            />
            {/* Tilted leaf — left half */}
            <g transform="rotate(-18 32 28)">
              <path
                d="M32 32C32 32 32 20 40 14C46 9.5 52 10.5 53.5 13C55 15.5 54 22 49 26.5C42 33 32 32 32 32Z"
                fill="url(#leafGrad)"
                opacity="0.85"
              />
            </g>
            {/* Cracked break line */}
            <path
              d="M22 40 L30 32 L26 30 L34 22"
              stroke="var(--color-destructive)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            {/* Ground */}
            <path
              d="M20 54H44"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeOpacity="0.4"
              className="text-[color:var(--color-muted-foreground)]"
            />
          </svg>
        </div>

        <p className="text-xs font-semibold uppercase tracking-wider text-[color:var(--color-destructive)]">
          {t.errors.app.eyebrow}
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[color:var(--color-foreground)]">
          {t.errors.app.title}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-[color:var(--color-muted-foreground)]">
          {t.errors.app.subtitle}
        </p>
        {error.digest && (
          <p className="mt-4 font-mono text-[11px] text-[color:var(--color-muted-foreground)]">
            {t.errors.app.digestLabel}:{" "}
            <span className="font-semibold">{error.digest}</span>
          </p>
        )}

        <div className="mt-7 flex flex-col items-center justify-center gap-2 sm:flex-row">
          <Button variant="primary" onClick={retry}>
            <RefreshCw className="size-4" />
            {t.errors.app.tryAgain}
          </Button>
          <Link href="/dashboard" className="contents">
            <Button variant="outline">
              <ArrowLeft className="size-4" />
              {t.errors.app.backToDashboard}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
