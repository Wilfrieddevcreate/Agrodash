"use client";

import * as React from "react";
import Link from "next/link";
import { AlertTriangle, ArrowLeft, RefreshCw } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useT } from "@/components/providers/language-provider";

/**
 * Dashboard-scoped error boundary. Rendered inside <Shell> so the sidebar,
 * header and chrome remain available — only the main content slot shows
 * the friendly recovery card.
 */
export default function DashboardError({
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
    console.error("[AgroDash] dashboard error:", error);
  }, [error]);

  const retry = React.useCallback(() => {
    if (unstable_retry) return unstable_retry();
    if (reset) return reset();
  }, [unstable_retry, reset]);

  return (
    <div className="mx-auto flex max-w-xl flex-col items-center py-14 text-center">
      <Card className="relative w-full overflow-hidden p-8">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-[color:var(--color-destructive)]/10 [mask-image:linear-gradient(to_bottom,black,transparent)]"
        />
        <div className="relative mx-auto mb-4 inline-flex size-14 items-center justify-center rounded-2xl bg-[color:var(--color-destructive)]/10 text-[color:var(--color-destructive)] ring-1 ring-[color:var(--color-destructive)]/25">
          <AlertTriangle className="size-6" />
        </div>
        <h2 className="relative text-xl font-semibold tracking-tight">
          {t.errors.dashboard.title}
        </h2>
        <p className="relative mt-2 text-sm leading-relaxed text-[color:var(--color-muted-foreground)]">
          {t.errors.dashboard.subtitle}
        </p>
        {error.digest && (
          <p className="relative mt-4 font-mono text-[11px] text-[color:var(--color-muted-foreground)]">
            {t.errors.app.digestLabel}:{" "}
            <span className="font-semibold">{error.digest}</span>
          </p>
        )}
        <div className="relative mt-6 flex flex-col items-center justify-center gap-2 sm:flex-row">
          <Button variant="primary" onClick={retry}>
            <RefreshCw className="size-4" />
            {t.errors.dashboard.tryAgain}
          </Button>
          <Link href="/dashboard" className="contents">
            <Button variant="outline">
              <ArrowLeft className="size-4" />
              {t.errors.dashboard.goHome}
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
