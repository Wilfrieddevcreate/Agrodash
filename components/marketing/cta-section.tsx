"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Mail } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useT } from "@/components/providers/language-provider";

export function CtaSection() {
  const t = useT();
  const [email, setEmail] = React.useState("");

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email");
      return;
    }
    toast.success("We'll be in touch", {
      description: `A starter invite will arrive at ${email}.`,
    });
    setEmail("");
  };

  return (
    <section className="relative py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="surface-premium relative overflow-hidden rounded-3xl border border-[color:var(--color-border)] p-8 shadow-elev-lg sm:p-12 lg:p-16"
        >
          {/* Mesh */}
          <div className="pointer-events-none absolute inset-0 mesh-hero opacity-100" aria-hidden />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-30 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]"
            style={{
              backgroundImage:
                "linear-gradient(to right, color-mix(in oklab, var(--color-border) 70%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in oklab, var(--color-border) 70%, transparent) 1px, transparent 1px)",
              backgroundSize: "36px 36px",
            }}
          />

          <div className="relative mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-[color:var(--color-primary)]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[color:var(--color-primary)] ring-1 ring-inset ring-[color:var(--color-primary)]/20">
              {t.marketing.cta.eyebrow}
            </span>
            <h2 className="mt-5 text-[30px] font-semibold tracking-[-0.03em] sm:text-[38px] lg:text-[46px]">
              {t.marketing.cta.title}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-[color:var(--color-muted-foreground)] sm:text-base">
              {t.marketing.cta.subtitle}
            </p>

            <form
              onSubmit={onSubmit}
              className="mx-auto mt-8 flex w-full max-w-md flex-col gap-2 sm:flex-row"
            >
              <div className="relative flex-1">
                <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[color:var(--color-muted-foreground)]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.marketing.cta.emailPlaceholder}
                  aria-label="Email"
                  className="h-11 w-full rounded-lg border border-[color:var(--color-border)] bg-[color:var(--color-card)] pl-9 pr-3 text-sm transition-all placeholder:text-[color:var(--color-muted-foreground)] focus-visible:border-[color:var(--color-ring)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-ring)]/30"
                />
              </div>
              <Button type="submit" variant="primary" size="lg">
                {t.marketing.cta.emailCta}
                <ArrowRight className="size-4" />
              </Button>
            </form>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-3 text-xs text-[color:var(--color-muted-foreground)]">
              <Link
                href="/register"
                className="font-semibold text-[color:var(--color-foreground)] underline-offset-4 hover:underline"
              >
                {t.marketing.cta.primary}
              </Link>
              <span className="opacity-50">·</span>
              <Link
                href="/help"
                className="font-semibold text-[color:var(--color-foreground)] underline-offset-4 hover:underline"
              >
                {t.marketing.cta.secondary}
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
