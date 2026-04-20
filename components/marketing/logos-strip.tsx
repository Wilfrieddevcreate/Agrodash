"use client";

import { motion } from "framer-motion";
import { useT } from "@/components/providers/language-provider";

const LOGOS = [
  "HarvestHub",
  "AgriCorp",
  "GreenLeaf",
  "Savana Coop",
  "FarmLine",
  "AquaAgri",
  "BioFarm",
  "SolAgri",
];

export function LogosStrip() {
  const t = useT();

  return (
    <section className="relative border-y border-[color:var(--color-border)] bg-[color:var(--color-muted)]/25">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className="text-center text-[11px] font-semibold uppercase tracking-[0.18em] text-[color:var(--color-muted-foreground)]"
        >
          {t.marketing.logos.title}
        </motion.p>
        <div className="mt-8 grid grid-cols-2 items-center gap-x-6 gap-y-6 sm:grid-cols-4 lg:grid-cols-8">
          {LOGOS.map((name, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 6 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: i * 0.04 }}
              className="flex items-center justify-center"
            >
              <FakeLogo name={name} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FakeLogo({ name }: { name: string }) {
  // Deterministic "mark" variation per name
  const marks = ["●", "◆", "▲", "■", "✦", "◉", "⬟", "◇"];
  const mark = marks[name.length % marks.length];
  return (
    <div className="inline-flex select-none items-center gap-1.5 text-[15px] font-semibold tracking-tight text-[color:var(--color-muted-foreground)] opacity-70 transition-opacity duration-300 hover:opacity-100">
      <span className="text-[color:var(--color-primary)]/70">{mark}</span>
      <span>{name}</span>
    </div>
  );
}
