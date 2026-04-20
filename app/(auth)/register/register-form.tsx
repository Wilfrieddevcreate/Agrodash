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

const STRENGTH_LABELS = [
  "Too short",
  "Weak",
  "Fair",
  "Good",
  "Strong",
] as const;

const SEGMENT_COLORS: Record<Score, string> = {
  0: "bg-[color:var(--color-muted)]",
  1: "bg-[color:var(--color-destructive)]",
  2: "bg-[color:var(--color-warning)]",
  3: "bg-[color:var(--color-warning)]",
  4: "bg-[color:var(--color-success)]",
};

export function RegisterForm() {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [org, setOrg] = React.useState("");
  const [terms, setTerms] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  const score = scorePassword(password);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!terms) {
      toast.error("Please accept the Terms", {
        description: "You need to agree before creating your workspace.",
      });
      return;
    }
    setSubmitting(true);
    toast.success("Workspace created", {
      description: "Redirecting to dashboard...",
    });
    window.setTimeout(() => setSubmitting(false), 900);
  }

  return (
    <AuthCard
      title="Create your workspace"
      description="Start managing your agribusiness in minutes"
      footer={
        <>
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-[color:var(--color-foreground)] underline-offset-4 hover:underline"
          >
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <div className="space-y-1.5">
          <Label htmlFor="name">Full name</Label>
          <Input
            id="name"
            autoComplete="name"
            required
            placeholder="Alex Rivera"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="email">Work email</Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            required
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <PasswordInput
            id="password"
            autoComplete="new-password"
            required
            placeholder="At least 8 characters"
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
                ? "8+ characters, with upper case, number & symbol"
                : `Strength: ${STRENGTH_LABELS[score]}`}
            </span>
          </FieldHint>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="org">Organization name</Label>
          <Input
            id="org"
            autoComplete="organization"
            required
            placeholder="Greenfield Co-op"
            value={org}
            onChange={(e) => setOrg(e.target.value)}
          />
        </div>

        <div className="flex items-start gap-3 pt-0.5">
          <Switch
            id="terms"
            checked={terms}
            onCheckedChange={setTerms}
            aria-label="Agree to terms and privacy policy"
          />
          <Label
            htmlFor="terms"
            className="cursor-pointer select-none text-[12.5px] leading-relaxed text-[color:var(--color-muted-foreground)]"
          >
            I agree to the{" "}
            <Link
              href="/"
              className="font-semibold text-[color:var(--color-foreground)] underline-offset-4 hover:underline"
            >
              Terms
            </Link>{" "}
            and{" "}
            <Link
              href="/"
              className="font-semibold text-[color:var(--color-foreground)] underline-offset-4 hover:underline"
            >
              Privacy Policy
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
          {submitting ? "Creating..." : "Create workspace"}
          <ArrowRight className="size-4" />
        </Button>
      </form>

      <Divider>Or continue with</Divider>

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
