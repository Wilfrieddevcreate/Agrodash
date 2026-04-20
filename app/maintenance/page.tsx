"use client";

import * as React from "react";
import { toast } from "sonner";
import { ArrowRight, CheckCircle2, Mail, Wrench } from "lucide-react";
import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useT } from "@/components/providers/language-provider";

export default function MaintenancePage() {
  const t = useT();
  const [email, setEmail] = React.useState("");
  const [submitted, setSubmitted] = React.useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
    toast.success(t.errors.maintenance.notifyToast, {
      description: t.errors.maintenance.notifyToastDesc,
    });
  }

  const services = [
    { key: "api", label: t.errors.maintenance.services.api, tone: "amber" },
    {
      key: "dashboard",
      label: t.errors.maintenance.services.dashboard,
      tone: "amber",
    },
    {
      key: "billing",
      label: t.errors.maintenance.services.billing,
      tone: "green",
    },
    {
      key: "webhooks",
      label: t.errors.maintenance.services.webhooks,
      tone: "amber",
    },
  ] as const;

  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden bg-[color:var(--color-background)] px-6 py-10">
      {/* Mesh backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-60 [mask-image:radial-gradient(circle_at_center,black,transparent_70%)]"
        style={{
          backgroundImage:
            "linear-gradient(to right, color-mix(in oklab, var(--color-border) 55%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in oklab, var(--color-border) 55%, transparent) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-64 w-[min(720px,90vw)] -translate-x-1/2 rounded-full bg-[color:var(--color-warning)]/18 blur-3xl"
      />

      <div className="relative z-10 w-full max-w-lg text-center">
        <div className="mx-auto mb-8 w-fit">
          <Logo />
        </div>

        <div className="relative mx-auto mb-6 flex size-24 items-center justify-center rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-card)] shadow-elev-md">
          <Wrench
            className="size-10 text-[color:var(--color-warning)]"
            strokeWidth={1.75}
          />
        </div>

        <p className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[color:var(--color-warning)]">
          <span className="relative inline-flex size-2">
            <span className="absolute inset-0 animate-ping rounded-full bg-[color:var(--color-warning)] opacity-70" />
            <span className="relative inline-block size-2 rounded-full bg-[color:var(--color-warning)]" />
          </span>
          {t.errors.maintenance.eyebrow}
        </p>

        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[color:var(--color-foreground)]">
          {t.errors.maintenance.title}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-[color:var(--color-muted-foreground)]">
          {t.errors.maintenance.subtitle}
        </p>

        {/* Status list */}
        <div className="mt-7 rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-card)] p-4 text-left shadow-elev-sm">
          <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-[color:var(--color-muted-foreground)]">
            {t.errors.maintenance.affectedServices}
          </p>
          <ul className="space-y-2">
            {services.map((s) => (
              <li
                key={s.key}
                className="flex items-center justify-between rounded-md px-1 py-1 text-sm"
              >
                <span className="flex items-center gap-2 text-[color:var(--color-foreground)]">
                  <span
                    className={
                      s.tone === "green"
                        ? "size-2 rounded-full bg-[color:var(--color-success)]"
                        : "size-2 animate-pulse rounded-full bg-[color:var(--color-warning)]"
                    }
                  />
                  {s.label}
                </span>
                <span
                  className={
                    s.tone === "green"
                      ? "text-xs font-medium text-[color:var(--color-success)]"
                      : "text-xs font-medium text-[color:var(--color-warning)]"
                  }
                >
                  {s.tone === "green" ? "Operational" : "Updating"}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Email form */}
        <form
          onSubmit={onSubmit}
          className="mt-5 rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-card)] p-4 text-left shadow-elev-sm"
        >
          <label
            htmlFor="maint-email"
            className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-[color:var(--color-muted-foreground)]"
          >
            {t.errors.maintenance.notifyLabel}
          </label>
          <div className="flex flex-col items-stretch gap-2 sm:flex-row">
            <div className="relative flex-1">
              <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[color:var(--color-muted-foreground)]" />
              <Input
                id="maint-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={submitted}
                placeholder={t.errors.maintenance.notifyPlaceholder}
                className="pl-9"
              />
            </div>
            <Button type="submit" variant="primary" disabled={submitted}>
              {submitted ? (
                <>
                  <CheckCircle2 className="size-4" />
                  {t.errors.maintenance.notifyToast}
                </>
              ) : (
                <>
                  {t.errors.maintenance.notifyCta}
                  <ArrowRight className="size-4" />
                </>
              )}
            </Button>
          </div>
        </form>

        <div className="mt-4">
          <Button variant="ghost" type="button">
            {t.errors.maintenance.checkStatus}
          </Button>
        </div>
      </div>
    </div>
  );
}
