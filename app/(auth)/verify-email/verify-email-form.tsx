"use client";

import * as React from "react";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthCard } from "@/components/auth/auth-card";
import { useT } from "@/components/providers/language-provider";
import { cn } from "@/lib/utils";

const CODE_LENGTH = 6;
const DEMO_EMAIL = "alex@agrodash.io";

export function VerifyEmailForm() {
  const t = useT();
  const [digits, setDigits] = React.useState<string[]>(() =>
    Array.from({ length: CODE_LENGTH }, () => "")
  );
  const [submitting, setSubmitting] = React.useState(false);
  const inputRefs = React.useRef<Array<HTMLInputElement | null>>([]);

  const isComplete = digits.every((d) => d !== "");

  function focusAt(index: number) {
    const el = inputRefs.current[index];
    if (el) {
      el.focus();
      el.select();
    }
  }

  function handleChange(index: number, raw: string) {
    // Accept digits only; take last typed char to support overtyping a filled cell.
    const clean = raw.replace(/\D/g, "");
    if (!clean) {
      setDigits((prev) => {
        const next = [...prev];
        next[index] = "";
        return next;
      });
      return;
    }

    const char = clean[clean.length - 1] ?? "";
    setDigits((prev) => {
      const next = [...prev];
      next[index] = char;
      return next;
    });

    if (index < CODE_LENGTH - 1) {
      focusAt(index + 1);
    }
  }

  function handleKeyDown(
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) {
    if (e.key === "Backspace") {
      if (digits[index]) {
        // Clear current cell; stay focused.
        setDigits((prev) => {
          const next = [...prev];
          next[index] = "";
          return next;
        });
      } else if (index > 0) {
        // Move to previous cell and clear it.
        e.preventDefault();
        setDigits((prev) => {
          const next = [...prev];
          next[index - 1] = "";
          return next;
        });
        focusAt(index - 1);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      focusAt(index - 1);
    } else if (e.key === "ArrowRight" && index < CODE_LENGTH - 1) {
      e.preventDefault();
      focusAt(index + 1);
    }
  }

  function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "");
    if (!pasted) return;
    e.preventDefault();
    const chars = pasted.slice(0, CODE_LENGTH).split("");
    setDigits((prev) => {
      const next = [...prev];
      for (let i = 0; i < CODE_LENGTH; i++) {
        next[i] = chars[i] ?? "";
      }
      return next;
    });
    const last = Math.min(chars.length, CODE_LENGTH) - 1;
    focusAt(last >= 0 ? last : 0);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!isComplete) return;
    setSubmitting(true);
    toast.success(t.auth.verify.toastSuccess, {
      description: t.auth.verify.toastSuccessDesc,
    });
    window.setTimeout(() => setSubmitting(false), 900);
  }

  return (
    <AuthCard
      title={t.auth.verify.title}
      description={
        <>
          {t.auth.verify.subtitlePrefix}{" "}
          <span className="font-medium text-[color:var(--color-foreground)]">
            {DEMO_EMAIL}
          </span>
        </>
      }
      footer={
        <>
          {t.auth.verify.wrongEmail}{" "}
          <Link
            href="/register"
            className="font-semibold text-[color:var(--color-foreground)] underline-offset-4 hover:underline"
          >
            {t.auth.verify.changeEmail}
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <div
          className="flex items-center justify-between gap-2 sm:gap-3"
          role="group"
          aria-label={t.auth.verify.codeAriaLabel}
        >
          {digits.map((digit, i) => (
            <input
              key={i}
              ref={(el) => {
                inputRefs.current[i] = el;
              }}
              type="text"
              inputMode="numeric"
              autoComplete={i === 0 ? "one-time-code" : "off"}
              maxLength={1}
              aria-label={`${t.auth.verify.digitAriaLabel} ${i + 1}`}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              onPaste={handlePaste}
              onFocus={(e) => e.currentTarget.select()}
              className={cn(
                "h-14 w-12 rounded-lg border bg-[color:var(--color-card)] text-center text-xl font-semibold tabular-nums text-[color:var(--color-foreground)]",
                "border-[color:var(--color-input)] shadow-elev-xs",
                "transition-[border-color,box-shadow,background-color,transform] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]",
                "hover:border-[color:var(--color-border)]",
                "focus-visible:outline-none focus-visible:border-[color:var(--color-ring)] focus-visible:ring-[3px] focus-visible:ring-[color:var(--color-ring)]/20",
                digit && "border-[color:var(--color-ring)]/60"
              )}
            />
          ))}
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          disabled={!isComplete || submitting}
        >
          {submitting ? t.auth.verify.submitting : t.auth.verify.submit}
          <ArrowRight className="size-4" />
        </Button>

        <ResendLine />
      </form>
    </AuthCard>
  );
}

function ResendLine() {
  const t = useT();
  return (
    <div className="text-center text-[12.5px] text-[color:var(--color-muted-foreground)]">
      {t.auth.verify.resendPrefix}{" "}
      <span className="font-semibold text-[color:var(--color-foreground)]">
        {t.auth.verify.resendIn}
      </span>
    </div>
  );
}
