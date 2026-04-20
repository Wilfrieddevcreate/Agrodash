"use client";

import * as React from "react";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { AuthCard } from "@/components/auth/auth-card";
import { SocialButtons } from "@/components/auth/social-buttons";
import { PasswordInput } from "@/components/auth/password-input";
import { useT } from "@/components/providers/language-provider";

export function LoginForm() {
  const t = useT();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [remember, setRemember] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    toast.success(t.auth.signIn.toastSuccess, {
      description: t.auth.signIn.toastSuccessDesc,
    });
    // Reset submitting after a short delay so the button doesn't stay locked
    // in this demo (no real auth or navigation occurs).
    window.setTimeout(() => setSubmitting(false), 900);
  }

  return (
    <AuthCard
      title={t.auth.signIn.title}
      description={t.auth.signIn.subtitle}
      footer={
        <>
          {t.auth.signIn.noAccount}{" "}
          <Link
            href="/register"
            className="font-semibold text-[color:var(--color-foreground)] underline-offset-4 hover:underline"
          >
            {t.auth.signIn.createOne}
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <div className="space-y-1.5">
          <Label htmlFor="email">{t.auth.signIn.email}</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            required
            placeholder={t.auth.signIn.emailPlaceholder}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">{t.auth.signIn.password}</Label>
            <Link
              href="/forgot-password"
              className="text-[12px] font-medium text-[color:var(--color-muted-foreground)] underline-offset-4 transition-colors hover:text-[color:var(--color-foreground)] hover:underline"
            >
              {t.auth.signIn.forgot}
            </Link>
          </div>
          <PasswordInput
            id="password"
            autoComplete="current-password"
            required
            placeholder={t.auth.signIn.passwordPlaceholder}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="flex items-center justify-between pt-0.5">
          <div className="flex items-center gap-2.5">
            <Switch
              id="remember"
              checked={remember}
              onCheckedChange={setRemember}
              aria-label={t.auth.signIn.rememberAria}
            />
            <Label htmlFor="remember" className="cursor-pointer select-none">
              {t.auth.signIn.remember}
            </Label>
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          disabled={submitting}
        >
          {submitting ? t.auth.signIn.submitting : t.auth.signIn.submit}
          <ArrowRight className="size-4" />
        </Button>
      </form>

      <Divider>{t.auth.signIn.orContinue}</Divider>

      <SocialButtons action="sign in" />
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
