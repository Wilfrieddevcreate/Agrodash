"use client";

import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";
import { useT } from "@/components/providers/language-provider";

export default function NotFound() {
  const t = useT();
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
        className="pointer-events-none absolute left-1/2 top-0 h-64 w-[min(720px,90vw)] -translate-x-1/2 rounded-full bg-[color:var(--color-primary)]/14 blur-3xl"
      />

      <div className="relative z-10 w-full max-w-lg text-center">
        <div className="mx-auto mb-8 w-fit">
          <Logo />
        </div>

        {/* 404 display */}
        <div className="relative inline-flex items-center justify-center">
          <div
            aria-hidden
            className="absolute inset-0 -z-10 bg-gradient-to-b from-[color:var(--color-primary)]/20 to-transparent blur-2xl"
          />
          <span className="bg-gradient-to-b from-[color:var(--color-foreground)] to-[color:var(--color-primary)] bg-clip-text font-mono text-7xl font-semibold tracking-tight text-transparent md:text-8xl">
            404
          </span>
        </div>

        <p className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[color:var(--color-primary)]">
          <Compass className="size-3.5" />
          {t.errors.notFound.eyebrow}
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-[color:var(--color-foreground)] sm:text-3xl">
          {t.errors.notFound.title}
        </h1>
        <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-[color:var(--color-muted-foreground)]">
          {t.errors.notFound.subtitle}
        </p>

        <div className="mt-7 flex flex-col items-center justify-center gap-2 sm:flex-row">
          <Link href="/" className="contents">
            <Button variant="primary">
              <ArrowLeft className="size-4" />
              {t.errors.notFound.goHome}
            </Button>
          </Link>
          <Button
            variant="outline"
            type="button"
            onClick={() => {
              if (typeof window !== "undefined") window.history.back();
            }}
          >
            {t.errors.notFound.goBack}
          </Button>
        </div>
      </div>
    </div>
  );
}
