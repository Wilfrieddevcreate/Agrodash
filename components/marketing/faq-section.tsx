"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useT } from "@/components/providers/language-provider";

export function FaqSection() {
  const t = useT();
  const items = t.marketing.faq.items;

  return (
    <section id="faq" className="relative scroll-mt-24 py-20 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)] lg:gap-16">
          {/* Left — title */}
          <div>
            <motion.span
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full bg-[color:var(--color-primary)]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[color:var(--color-primary)] ring-1 ring-inset ring-[color:var(--color-primary)]/20"
            >
              {t.marketing.faq.eyebrow}
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.55, delay: 0.05 }}
              className="mt-4 text-[28px] font-semibold tracking-[-0.025em] sm:text-[34px] lg:text-[40px]"
            >
              {t.marketing.faq.title}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.55, delay: 0.1 }}
              className="mt-4 max-w-md text-[15px] leading-relaxed text-[color:var(--color-muted-foreground)] sm:text-base"
            >
              {t.marketing.faq.subtitle}
            </motion.p>
          </div>

          {/* Right — accordion */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-card)] shadow-elev-sm"
          >
            {items.map((item, i) => (
              <details
                key={item.q}
                className="group border-b border-[color:var(--color-border)]/70 last:border-b-0 [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="flex cursor-pointer list-none items-start justify-between gap-6 px-5 py-5 text-left text-[15px] font-semibold text-[color:var(--color-foreground)] transition-colors hover:bg-[color:var(--color-muted)]/40 sm:px-6">
                  <span>{item.q}</span>
                  <ChevronDown
                    aria-hidden
                    className="mt-0.5 size-5 shrink-0 text-[color:var(--color-muted-foreground)] transition-transform duration-300 group-open:rotate-180 group-open:text-[color:var(--color-primary)]"
                  />
                </summary>
                <div className="px-5 pb-6 text-[14.5px] leading-relaxed text-[color:var(--color-muted-foreground)] sm:px-6">
                  {item.a}
                </div>
              </details>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
