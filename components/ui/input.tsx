import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Shared control geometry — used by Input, Textarea, Select trigger so the
 * whole form language feels like one instrument.
 */
const fieldBase = [
  "flex w-full rounded-lg border bg-[color:var(--color-card)] text-sm",
  "border-[color:var(--color-input)]",
  "text-[color:var(--color-foreground)]",
  "placeholder:text-[color:var(--color-muted-foreground)]",
  "shadow-elev-xs",
  "transition-[border-color,box-shadow,background-color] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]",
  "focus-visible:outline-none focus-visible:border-[color:var(--color-ring)]",
  "focus-visible:ring-[3px] focus-visible:ring-[color:var(--color-ring)]/20",
  "disabled:cursor-not-allowed disabled:opacity-50",
  "hover:border-[color:var(--color-border)]",
].join(" ");

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type = "text", ...props }, ref) => (
  <input
    ref={ref}
    type={type}
    className={cn(
      fieldBase,
      "h-10 px-3 py-2 file:border-0 file:bg-transparent file:text-sm file:font-medium",
      className
    )}
    {...props}
  />
));
Input.displayName = "Input";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      fieldBase,
      "min-h-[96px] resize-y px-3 py-2.5 leading-relaxed",
      className
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";

export function Label({
  className,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn(
        "text-[13px] font-medium leading-none text-[color:var(--color-foreground)]",
        className
      )}
      {...props}
    />
  );
}

export function FieldHint({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn(
        "text-[11px] leading-relaxed text-[color:var(--color-muted-foreground)]",
        className
      )}
      {...props}
    />
  );
}

export { fieldBase };
