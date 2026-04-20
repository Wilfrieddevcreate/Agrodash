import * as React from "react";
import { cn } from "@/lib/utils";
import { initials } from "@/lib/utils";

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  name?: string;
  src?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

const sizeMap = {
  sm: "size-7 text-[10px]",
  md: "size-9 text-xs",
  lg: "size-11 text-sm",
  xl: "size-16 text-base",
};

export function Avatar({
  name = "",
  src,
  size = "md",
  className,
  ...props
}: AvatarProps) {
  return (
    <div
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-[color:var(--color-primary)]/25 to-[color:var(--color-accent)]/30 font-semibold text-[color:var(--color-primary)] ring-1 ring-inset ring-[color:var(--color-border)]",
        sizeMap[size],
        className
      )}
      {...props}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={name} className="size-full object-cover" />
      ) : (
        <span className="select-none">{initials(name || "?")}</span>
      )}
    </div>
  );
}
