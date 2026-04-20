import * as React from "react";
import { cn } from "@/lib/utils";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type = "text", ...props }, ref) => (
  <input
    ref={ref}
    type={type}
    className={cn(
      "flex h-10 w-full rounded-lg border border-[color:var(--color-input)] bg-[color:var(--color-card)] px-3 py-2 text-sm transition-colors",
      "placeholder:text-[color:var(--color-muted-foreground)]",
      "focus-visible:outline-none focus-visible:border-[color:var(--color-ring)] focus-visible:ring-2 focus-visible:ring-[color:var(--color-ring)]/40",
      "disabled:cursor-not-allowed disabled:opacity-50",
      "file:border-0 file:bg-transparent file:text-sm file:font-medium",
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
      "flex min-h-[90px] w-full rounded-lg border border-[color:var(--color-input)] bg-[color:var(--color-card)] px-3 py-2 text-sm transition-colors",
      "placeholder:text-[color:var(--color-muted-foreground)]",
      "focus-visible:outline-none focus-visible:border-[color:var(--color-ring)] focus-visible:ring-2 focus-visible:ring-[color:var(--color-ring)]/40",
      "disabled:cursor-not-allowed disabled:opacity-50",
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
        "text-sm font-medium text-[color:var(--color-foreground)]",
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
        "text-xs text-[color:var(--color-muted-foreground)]",
        className
      )}
      {...props}
    />
  );
}
