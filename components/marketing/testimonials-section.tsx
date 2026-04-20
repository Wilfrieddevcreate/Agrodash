"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { useT } from "@/components/providers/language-provider";

export function TestimonialsSection() {
  const t = useT();
  const items = t.marketing.testimonials.items;
  const cards: Array<keyof typeof items> = ["one", "two", "three"];

  return (
    <section className="relative py-20 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full bg-[color:var(--color-primary)]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[color:var(--color-primary)] ring-1 ring-inset ring-[color:var(--color-primary)]/20"
          >
            {t.marketing.testimonials.eyebrow}
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.55, delay: 0.05 }}
            className="mt-4 text-[28px] font-semibold tracking-[-0.025em] sm:text-[34px] lg:text-[40px]"
          >
            {t.marketing.testimonials.title}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="mt-4 text-[15px] leading-relaxed text-[color:var(--color-muted-foreground)] sm:text-base"
          >
            {t.marketing.testimonials.subtitle}
          </motion.p>
        </div>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {cards.map((key, i) => {
            const c = items[key];
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  duration: 0.55,
                  delay: i * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="relative flex flex-col rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-card)] p-6 shadow-elev-sm transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-0.5 hover:border-[color:var(--color-primary)]/20 hover:shadow-elev-md"
              >
                <Quote
                  aria-hidden
                  className="size-7 text-[color:var(--color-primary)]/30"
                />

                <p className="mt-3 flex-1 text-[15px] leading-relaxed text-[color:var(--color-foreground)]/90">
                  “{c.quote}”
                </p>

                <div className="mt-5 flex items-center gap-0.5 text-[color:var(--color-warning)]">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className="size-4 fill-current" />
                  ))}
                </div>

                <div className="mt-5 flex items-center gap-3 border-t border-[color:var(--color-border)]/70 pt-4">
                  <Avatar name={c.name} size="md" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-semibold">
                      {c.name}
                    </div>
                    <div className="truncate text-xs text-[color:var(--color-muted-foreground)]">
                      {c.role} · {c.company}
                    </div>
                  </div>
                  <span className="inline-flex items-center rounded-full bg-[color:var(--color-muted)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[color:var(--color-muted-foreground)] ring-1 ring-inset ring-[color:var(--color-border)]">
                    {c.company.split(" ")[0]}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
