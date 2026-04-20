"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

type Side = "top" | "bottom" | "left" | "right";

const GAP = 8;
const MARGIN = 6;

function fitsOnSide(
  side: Side,
  rect: DOMRect,
  tipW: number,
  tipH: number,
  vw: number,
  vh: number
) {
  switch (side) {
    case "top":
      return rect.top - tipH - GAP >= MARGIN;
    case "bottom":
      return rect.bottom + tipH + GAP <= vh - MARGIN;
    case "left":
      return rect.left - tipW - GAP >= MARGIN;
    case "right":
      return rect.right + tipW + GAP <= vw - MARGIN;
  }
}

function computeCoords(
  side: Side,
  rect: DOMRect,
  tipW: number,
  tipH: number,
  vw: number,
  vh: number
) {
  let x = 0;
  let y = 0;
  switch (side) {
    case "top":
      x = rect.left + rect.width / 2 - tipW / 2;
      y = rect.top - tipH - GAP;
      break;
    case "bottom":
      x = rect.left + rect.width / 2 - tipW / 2;
      y = rect.bottom + GAP;
      break;
    case "left":
      x = rect.left - tipW - GAP;
      y = rect.top + rect.height / 2 - tipH / 2;
      break;
    case "right":
      x = rect.right + GAP;
      y = rect.top + rect.height / 2 - tipH / 2;
      break;
  }
  // Clamp within the viewport
  x = Math.max(MARGIN, Math.min(x, vw - tipW - MARGIN));
  y = Math.max(MARGIN, Math.min(y, vh - tipH - MARGIN));
  return { x, y };
}

export function Tooltip({
  content,
  children,
  side = "top",
  delay = 120,
  className,
}: {
  content: React.ReactNode;
  children: React.ReactNode;
  side?: Side;
  delay?: number;
  className?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const [placement, setPlacement] = React.useState<Side>(side);
  const [coords, setCoords] = React.useState<{ x: number; y: number } | null>(
    null
  );
  const [mounted, setMounted] = React.useState(false);

  const triggerRef = React.useRef<HTMLSpanElement>(null);
  const tooltipRef = React.useRef<HTMLDivElement>(null);
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => setMounted(true), []);

  const reposition = React.useCallback(() => {
    const trigger = triggerRef.current;
    const tip = tooltipRef.current;
    if (!trigger || !tip) return;
    const rect = trigger.getBoundingClientRect();
    const tipW = tip.offsetWidth;
    const tipH = tip.offsetHeight;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // Auto-flip: try preferred side first, then common fallbacks.
    const order: Side[] =
      side === "right"
        ? ["right", "left", "bottom", "top"]
        : side === "left"
        ? ["left", "right", "bottom", "top"]
        : side === "bottom"
        ? ["bottom", "top", "right", "left"]
        : ["top", "bottom", "right", "left"];

    const chosen =
      order.find((s) => fitsOnSide(s, rect, tipW, tipH, vw, vh)) ?? side;
    setPlacement(chosen);
    setCoords(computeCoords(chosen, rect, tipW, tipH, vw, vh));
  }, [side]);

  function show() {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setOpen(true);
      // Place next frame — tooltip size is measurable after render.
      requestAnimationFrame(() => requestAnimationFrame(reposition));
    }, delay);
  }

  function hide() {
    if (timerRef.current) clearTimeout(timerRef.current);
    setOpen(false);
  }

  // Reposition on scroll / resize while visible
  React.useEffect(() => {
    if (!open) return;
    reposition();
    const onScroll = () => reposition();
    window.addEventListener("scroll", onScroll, true);
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll, true);
      window.removeEventListener("resize", onScroll);
    };
  }, [open, reposition]);

  React.useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    []
  );

  const originClass = {
    top: "origin-bottom",
    bottom: "origin-top",
    left: "origin-right",
    right: "origin-left",
  }[placement];

  return (
    <>
      <span
        ref={triggerRef}
        className="relative inline-flex"
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
      >
        {children}
      </span>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {open && (
              <motion.div
                ref={tooltipRef}
                role="tooltip"
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.14, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  position: "fixed",
                  top: coords?.y ?? -9999,
                  left: coords?.x ?? -9999,
                  pointerEvents: "none",
                }}
                className={cn(
                  "z-[9999] max-w-[min(280px,90vw)] rounded-md px-2.5 py-1.5 text-xs font-medium shadow-lg ring-1 ring-black/5",
                  "bg-[color:var(--color-foreground)] text-[color:var(--color-background)]",
                  originClass,
                  className
                )}
              >
                {content}
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}
