"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  /** Total sibling page numbers shown on each side of the current page */
  siblingCount?: number;
  /** Localised labels */
  labels?: {
    showing: string;
    of: string;
    results: string;
    prev: string;
    next: string;
  };
  className?: string;
}

/** Produces a page-range with ellipses, e.g. [1, "…", 4, 5, 6, "…", 12] */
function buildRange(
  current: number,
  total: number,
  siblings: number
): Array<number | "ellipsis"> {
  const totalNumbers = siblings * 2 + 5; // first + last + current + 2*siblings + 2*ellipsis
  if (total <= totalNumbers) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const leftSibling = Math.max(current - siblings, 1);
  const rightSibling = Math.min(current + siblings, total);
  const showLeftEllipsis = leftSibling > 2;
  const showRightEllipsis = rightSibling < total - 1;

  const firstPage = 1;
  const lastPage = total;

  if (!showLeftEllipsis && showRightEllipsis) {
    const leftRange = Array.from(
      { length: 3 + 2 * siblings },
      (_, i) => i + 1
    );
    return [...leftRange, "ellipsis", lastPage];
  }

  if (showLeftEllipsis && !showRightEllipsis) {
    const rightCount = 3 + 2 * siblings;
    const rightRange = Array.from(
      { length: rightCount },
      (_, i) => total - rightCount + 1 + i
    );
    return [firstPage, "ellipsis", ...rightRange];
  }

  const middleRange = Array.from(
    { length: rightSibling - leftSibling + 1 },
    (_, i) => leftSibling + i
  );
  return [firstPage, "ellipsis", ...middleRange, "ellipsis", lastPage];
}

export function Pagination({
  page,
  pageSize,
  total,
  onPageChange,
  siblingCount = 1,
  labels = {
    showing: "Showing",
    of: "of",
    results: "results",
    prev: "Previous",
    next: "Next",
  },
  className,
}: PaginationProps) {
  if (total === 0) return null;

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const current = Math.min(Math.max(1, page), totalPages);
  const start = (current - 1) * pageSize + 1;
  const end = Math.min(current * pageSize, total);
  const range = buildRange(current, totalPages, siblingCount);

  function go(p: number) {
    const next = Math.min(Math.max(1, p), totalPages);
    if (next !== current) onPageChange(next);
  }

  return (
    <nav
      aria-label="Pagination"
      className={cn(
        "flex flex-col items-center justify-between gap-3 border-t border-[color:var(--color-border)] px-1 pt-4 text-xs sm:flex-row sm:text-sm",
        className
      )}
    >
      {/* Range summary */}
      <p className="text-center text-[color:var(--color-muted-foreground)] sm:text-left">
        {labels.showing}{" "}
        <span className="font-medium text-[color:var(--color-foreground)] tabular-nums">
          {start.toLocaleString()}–{end.toLocaleString()}
        </span>{" "}
        {labels.of}{" "}
        <span className="font-medium text-[color:var(--color-foreground)] tabular-nums">
          {total.toLocaleString()}
        </span>{" "}
        {labels.results}
      </p>

      {/* Controls */}
      <ul className="inline-flex items-center gap-1">
        {/* Prev */}
        <li>
          <button
            type="button"
            onClick={() => go(current - 1)}
            disabled={current === 1}
            aria-label={labels.prev}
            className={cn(
              "inline-flex size-8 items-center justify-center rounded-md text-[color:var(--color-muted-foreground)] transition-colors",
              "hover:bg-[color:var(--color-muted)] hover:text-[color:var(--color-foreground)]",
              "disabled:pointer-events-none disabled:opacity-40"
            )}
          >
            <ChevronLeft className="size-4 rtl:scale-x-[-1]" />
          </button>
        </li>

        {/* Numbers */}
        {range.map((item, i) =>
          item === "ellipsis" ? (
            <li
              key={`e-${i}`}
              aria-hidden
              className="grid size-8 place-items-center text-[color:var(--color-muted-foreground)]"
            >
              <MoreHorizontal className="size-3.5" />
            </li>
          ) : (
            <li key={item}>
              <button
                type="button"
                onClick={() => go(item)}
                aria-current={item === current ? "page" : undefined}
                aria-label={`Page ${item}`}
                className={cn(
                  "inline-flex size-8 items-center justify-center rounded-md text-[13px] font-medium tabular-nums transition-all",
                  item === current
                    ? "bg-[color:var(--color-foreground)] text-[color:var(--color-background)]"
                    : "text-[color:var(--color-muted-foreground)] hover:bg-[color:var(--color-muted)] hover:text-[color:var(--color-foreground)]"
                )}
              >
                {item}
              </button>
            </li>
          )
        )}

        {/* Next */}
        <li>
          <button
            type="button"
            onClick={() => go(current + 1)}
            disabled={current === totalPages}
            aria-label={labels.next}
            className={cn(
              "inline-flex size-8 items-center justify-center rounded-md text-[color:var(--color-muted-foreground)] transition-colors",
              "hover:bg-[color:var(--color-muted)] hover:text-[color:var(--color-foreground)]",
              "disabled:pointer-events-none disabled:opacity-40"
            )}
          >
            <ChevronRight className="size-4 rtl:scale-x-[-1]" />
          </button>
        </li>
      </ul>
    </nav>
  );
}
