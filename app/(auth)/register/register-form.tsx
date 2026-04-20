"use client";

import * as React from "react";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label, FieldHint } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { AuthCard } from "@/components/auth/auth-card";
import { SocialButtons } from "@/components/auth/social-buttons";
import { PasswordInput } from "@/components/auth/password-input";
import { useT } from "@/components/providers/language-provider";
import { cn } from "@/lib/utils";

type Score = 0 | 1 | 2 | 3 | 4;

function scorePassword(pw: string): Score {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s as Score;
}

const SEGMENT_COLORS: Record<Score, string> = {
  0: "bg-[color:var(--color-muted)]",
  1: "bg-[color:var(--color-destructive)]",
  2: "bg-[color:var(--color-warning)]",
  3: "bg-[color:var(--color-warning)]",
  4: "bg-[color:var(--color-success)]",
};

export function RegisterForm() {
  const t = useT();
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [org, setOrg] = React.useState("");
  const [terms, setTerms] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  const score = scorePassword(password);

  const strengthLabels: Record<Score, string> = {
    0: t.auth.signUp.passwordStrength.tooShort,
    1: t.auth.signUp.passwordStrength.weak,
    2: t.auth.signUp.passwordStrength.fair,
    3: t.auth.signUp.passwordStrength.good,
    4: t.auth.signUp.passwordStrength.strong,
  };

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!terms) {
      toast.error(t.auth.signUp.toastTermsError, {
        description: t.auth.signUp.toastTermsErrorDesc,
      });
      return;
    }
    setSubmitting(true);
    toast.success(t.auth.signUp.toastSuccess, {
      description: t.auth.signUp.toastSuccessDesc,
    });
    window.setTimeout(() => setSubmitting(false), 900);
  }

  return (
    <AuthCard
      title={t.auth.signUp.title}
      description={t.auth.signUp.subtitle}
      footer={
        <>
          {t.auth.signUp.hasAccount}{" "}
          <Link
            href="/login"
            className="font-semibold text-[color:var(--color-foreground)] underline-offset-4 hover:underline"
          >
            {t.auth.signUp.signInLink}
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <div className="space-y-1.5">
          <Label htmlFor="name">{t.auth.signUp.fullName}</Label>
          <Input
            id="name"
            autoComplete="name"
            required
            placeholder={t.auth.signUp.fullNamePlaceholder}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email">{t.auth.signUp.workEmail}</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            required
            placeholder={t.auth.signUp.workEmailPlaceholder}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password">{t.auth.signUp.password}</Label>
          <PasswordInput
            id="password"
            autoComplete="new-password"
            required
            placeholder={t.auth.signUp.passwordPlaceholder}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div
            className="flex items-center gap-1.5 pt-1.5"
            aria-hidden="true"
          >
            {[0, 1, 2, 3].map((i) => {
              const filled = score > i;
              return (
                <div
                  key={i}
                  className={cn(
                    "h-1 flex-1 rounded-full transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
                    filled
                      ? SEGMENT_COLORS[score]
                      : "bg-[color:var(--color-muted)]"
                  )}
                />
              );
            })}
          </div>
          <FieldHint
            aria-live="polite"
            className={cn(
              "flex items-center justify-between",
              score >= 3 && "text-[color:var(--color-success)]"
            )}
          >
            <span>
              {password.length === 0
                ? t.auth.signUp.passwordHint
                : `${t.auth.signUp.strengthLabel}: ${strengthLabels[score]}`}
            </span>
          </FieldHint>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="org">{t.auth.signUp.org}</Label>
          <Input
            id="org"
            autoComplete="organization"
            required
            placeholder={t.auth.signUp.orgPlaceholder}
            value={org}
            onChange={(e) => setOrg(e.target.value)}
          />
        </div>

        <div className="flex items-start gap-3 pt-0.5">
          <Switch
            id="terms"
            checked={terms}
            onCheckedChange={setTerms}
            aria-label={t.auth.signUp.termsAria}
          />
          <Label
            htmlFor="terms"
            className="cursor-pointer select-none text-[12.5px] leading-relaxed text-[color:var(--color-muted-foreground)]"
          >
            {t.auth.signUp.terms}{" "}
            <Link
              href="/"
              className="font-semibold text-[color:var(--color-foreground)] underline-offset-4 hover:underline"
            >
              {t.auth.signUp.termsLink}
            </Link>{" "}
            {t.auth.signUp.and}{" "}
            <Link
              href="/"
              className="font-semibold text-[color:var(--color-foreground)] underline-offset-4 hover:underline"
            >
              {t.auth.signUp.privacyLink}
            </Link>
            .
          </Label>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          disabled={submitting}
        >
          {submitting ? t.auth.signUp.submitting : t.auth.signUp.submit}
          <ArrowRight className="size-4" />
        </Button>
      </form>

      <Divider>{t.auth.signUp.orContinue}</Divider>

      <SocialButtons action="sign up" />
    </AuthCard>
  );
}

function Divider({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      <div className="absolute inset-0 flex items-center" aria-hidden="true">
        <div className="w-full border-t border-[color:var(--color-border)]" />
      </div>
      <div className="relative flex justify-center">
        <span className="bg-[color:var(--color-card)] px-3 text-[10.5px] font-medium uppercase tracking-[0.14em] text-[color:var(--color-muted-foreground)]">
          {children}
        </span>
      </div>
    </div>
  );
}
