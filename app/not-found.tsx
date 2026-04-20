import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/layout/logo";

export default function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center bg-[color:var(--color-background)] px-6">
      <div className="text-center">
        <div className="mx-auto mb-6 w-fit">
          <Logo />
        </div>
        <div className="font-mono text-6xl font-semibold tracking-tight text-[color:var(--color-primary)] md:text-7xl">
          404
        </div>
        <h1 className="mt-3 text-2xl font-semibold">Page not found</h1>
        <p className="mt-2 max-w-md text-sm text-[color:var(--color-muted-foreground)]">
          The page you&apos;re looking for has been harvested, moved, or never
          existed. Let&apos;s get you back.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center gap-1.5 rounded-lg bg-[color:var(--color-primary)] px-4 py-2 text-sm font-semibold text-[color:var(--color-primary-foreground)] shadow-sm transition-all hover:brightness-110"
        >
          <ArrowLeft className="size-4" />
          Back to dashboard
        </Link>
      </div>
    </div>
  );
}
