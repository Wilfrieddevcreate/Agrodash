"use client";

import * as React from "react";
import Link from "next/link";
import { Logo } from "@/components/layout/logo";
import { useT } from "@/components/providers/language-provider";

/* Inline brand glyphs — lucide-react dropped brand marks in 1.x, and
 * embedding official brand SVGs is the shadcn convention. */
function GithubGlyph(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M12 0.296875C5.37109 0.296875 0 5.67188 0 12.3008C0 17.6055 3.43750 22.0977 8.20703 23.6836C8.80859 23.7930 9.02734 23.4258 9.02734 23.1133C9.02734 22.832 9.01562 22.0898 9.00781 21.1055C5.67188 21.8281 4.96875 19.4961 4.96875 19.4961C4.42188 18.1094 3.63672 17.7422 3.63672 17.7422C2.54688 17.0000 3.71875 17.0156 3.71875 17.0156C4.92188 17.1016 5.55469 18.2500 5.55469 18.2500C6.62500 20.0820 8.36328 19.5508 9.04688 19.2461C9.15625 18.4727 9.46875 17.9414 9.81250 17.6523C7.14453 17.3555 4.33984 16.3242 4.33984 11.6719C4.33984 10.3477 4.80859 9.26172 5.57813 8.40625C5.45313 8.10938 5.03906 6.86719 5.69141 5.18750C5.69141 5.18750 6.70312 4.86719 9.00000 6.41797C9.96094 6.14844 10.9883 6.01562 12.0000 6.01172C13.0117 6.01562 14.0391 6.14844 15.0039 6.41797C17.2969 4.86719 18.3047 5.18750 18.3047 5.18750C18.9609 6.86719 18.5469 8.10938 18.4219 8.40625C19.1914 9.26172 19.6562 10.3477 19.6562 11.6719C19.6562 16.3359 16.8477 17.3516 14.1719 17.6445C14.6055 18.0195 14.9961 18.7656 14.9961 19.9102C14.9961 21.5586 14.9805 22.7070 14.9805 23.1133C14.9805 23.4297 15.1953 23.7988 15.8047 23.6836C20.5664 22.0937 24 17.6055 24 12.3008C24 5.67188 18.6289 0.296875 12 0.296875Z" />
    </svg>
  );
}

function XGlyph(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LinkedinGlyph(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.352V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.063 2.063 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

export function MarketingFooter() {
  const t = useT();
  const year = new Date().getFullYear();
  const l = t.marketing.footer.links;

  const columns: Array<{
    title: string;
    items: Array<{ label: string; href: string; external?: boolean }>;
  }> = [
    {
      title: t.marketing.footer.product,
      items: [
        { label: l.features, href: "/#features" },
        { label: l.pricing, href: "/pricing" },
        { label: l.changelog, href: "/help" },
        { label: l.roadmap, href: "/help" },
      ],
    },
    {
      title: t.marketing.footer.resources,
      items: [
        { label: l.docs, href: "/help" },
        { label: l.guides, href: "/help" },
        { label: l.api, href: "/help" },
        { label: l.status, href: "/help" },
      ],
    },
    {
      title: t.marketing.footer.company,
      items: [
        { label: l.about, href: "/" },
        { label: l.customers, href: "/" },
        { label: l.careers, href: "/" },
        { label: l.contact, href: "/" },
      ],
    },
    {
      title: t.marketing.footer.legal,
      items: [
        { label: l.terms, href: "/" },
        { label: l.privacy, href: "/" },
        { label: l.cookies, href: "/" },
        { label: l.dpa, href: "/" },
      ],
    },
  ];

  return (
    <footer className="relative border-t border-[color:var(--color-border)] bg-[color:var(--color-background)]">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-6">
          {/* Brand column spans 2 */}
          <div className="col-span-2">
            <Logo iconOnly={false} />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-[color:var(--color-muted-foreground)]">
              {t.marketing.footer.tagline}
            </p>
            <div className="mt-6 flex items-center gap-1.5">
              {[
                { icon: GithubGlyph, label: "GitHub", href: "https://github.com" },
                { icon: XGlyph, label: "X", href: "https://x.com" },
                { icon: LinkedinGlyph, label: "LinkedIn", href: "https://linkedin.com" },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  aria-label={s.label}
                  className="inline-flex size-9 items-center justify-center rounded-md text-[color:var(--color-muted-foreground)] transition-colors hover:bg-[color:var(--color-muted)] hover:text-[color:var(--color-foreground)]"
                >
                  <s.icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <div key={col.title}>
              <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[color:var(--color-muted-foreground)]">
                {col.title}
              </div>
              <ul className="mt-4 space-y-2.5">
                {col.items.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-sm text-[color:var(--color-foreground)]/80 transition-colors hover:text-[color:var(--color-primary)]"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-3 border-t border-[color:var(--color-border)] pt-6 text-xs text-[color:var(--color-muted-foreground)] sm:flex-row sm:items-center">
          <span>
            {t.marketing.footer.copyright.replace("{year}", String(year))}
          </span>
          <span className="font-mono tracking-tight">v1.0.0 · shipped with care</span>
        </div>
      </div>
    </footer>
  );
}
