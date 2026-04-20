import * as React from "react";
import { cn } from "@/lib/utils";

export function PageHeader({
  title,
  description,
  actions,
  className,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mb-5 flex flex-col gap-3 sm:mb-6 sm:gap-4 md:flex-row md:items-end md:justify-between",
        className
      )}
    >
      <div className="min-w-0">
        <h1 className="break-words text-[22px] font-semibold tracking-[-0.02em] leading-[1.15] text-[color:var(--color-foreground)] sm:text-[26px] md:text-[30px] lg:text-[32px]">
          {title}
        </h1>
        {description && (
          <p className="mt-1.5 text-[13px] text-[color:var(--color-muted-foreground)] sm:text-sm md:text-[15px]">
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex flex-wrap items-center gap-2 [&>*]:flex-1 sm:[&>*]:flex-none">
          {actions}
        </div>
      )}
    </div>
  );
}
