"use client";

import * as React from "react";
import { Check, Monitor, Moon, Sun, Upload } from "lucide-react";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input, Label, Textarea } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/layout/page-header";
import { useLanguage, useT } from "@/components/providers/language-provider";
import type { Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/**
 * Short inline hint shown under the language select when Arabic is active.
 * Hand-translated per UI locale because this string lives outside the main
 * dictionary (it's a meta-description of the selected language itself).
 */
function rtlNoticeLabel(locale: Locale): string {
  switch (locale) {
    case "fr":
      return "العربية s'affiche de droite à gauche.";
    case "ar":
      return "العربية تُعرض من اليمين إلى اليسار.";
    default:
      return "العربية uses a right-to-left layout.";
  }
}

export function SettingsPage() {
  const t = useT();
  const { locale, setLocale } = useLanguage();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const [currency, setCurrency] = React.useState("USD");

  React.useEffect(() => setMounted(true), []);

  const themeOptions = [
    { id: "light", label: t.settings.preferences.themeLight, icon: Sun },
    { id: "dark", label: t.settings.preferences.themeDark, icon: Moon },
    { id: "system", label: t.settings.preferences.themeSystem, icon: Monitor },
  ];

  return (
    <>
      <PageHeader
        eyebrow={t.settings.eyebrow}
        title={t.settings.title}
        description={t.settings.subtitle}
      />

      <Tabs defaultValue="profile">
        <TabsList className="mb-5 flex w-full overflow-x-auto scrollbar-none sm:w-auto">
          <TabsTrigger value="profile">{t.settings.tabs.profile}</TabsTrigger>
          <TabsTrigger value="preferences">
            {t.settings.tabs.preferences}
          </TabsTrigger>
          <TabsTrigger value="notifications">
            {t.settings.tabs.notifications}
          </TabsTrigger>
          <TabsTrigger value="billing">{t.settings.tabs.billing}</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>{t.settings.profile.title}</CardTitle>
              <CardDescription>{t.settings.profile.subtitle}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6 flex items-center gap-4">
                <Avatar name="Alex Diallo" size="xl" className="size-20 text-xl" />
                <div>
                  <Label className="mb-1 block">
                    {t.settings.profile.avatar}
                  </Label>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Upload />
                      {t.settings.profile.upload}
                    </Button>
                    <Button size="sm" variant="ghost">
                      {t.settings.profile.remove}
                    </Button>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label={t.settings.profile.fullName} defaultValue="Alex Diallo" />
                <Field label={t.settings.profile.email} defaultValue="alex@agrodash.io" />
                <Field label={t.settings.profile.role} defaultValue="Operations lead" />
                <Field
                  label={t.settings.profile.company}
                  defaultValue="AgroDash Cooperative"
                />
                <Field label={t.settings.profile.phone} defaultValue="+221 77 123 4567" />
                <div className="sm:col-span-2">
                  <Label className="mb-1.5 block">
                    {t.settings.profile.bio}
                  </Label>
                  <Textarea
                    rows={3}
                    defaultValue="Leading operations for a coalition of West-African smallholder farmers focused on drought-resistant grains."
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <Button onClick={() => toast.success(t.common.toast.saved)}>
                  {t.settings.profile.save}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences">
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{t.settings.preferences.theme}</CardTitle>
                <CardDescription>
                  {t.settings.preferences.themeDesc}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {themeOptions.map((opt) => {
                    const active = mounted && theme === opt.id;
                    const Icon = opt.icon;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setTheme(opt.id)}
                        className={cn(
                          "group relative flex flex-col items-start overflow-hidden rounded-xl border p-4 text-left transition-all",
                          active
                            ? "border-[color:var(--color-primary)] bg-[color:var(--color-primary)]/5 shadow-sm"
                            : "border-[color:var(--color-border)] hover:border-[color:var(--color-primary)]/50 hover:bg-[color:var(--color-muted)]/50"
                        )}
                      >
                        {active && (
                          <span className="absolute right-3 top-3 grid size-5 place-items-center rounded-full bg-[color:var(--color-primary)] text-[color:var(--color-primary-foreground)]">
                            <Check className="size-3" />
                          </span>
                        )}
                        <span className="grid size-9 place-items-center rounded-lg bg-[color:var(--color-muted)] text-[color:var(--color-foreground)]">
                          <Icon className="size-4" />
                        </span>
                        <div className="mt-3 text-sm font-semibold">
                          {opt.label}
                        </div>
                        <div className="mt-3 h-14 w-full overflow-hidden rounded-md ring-1 ring-[color:var(--color-border)]">
                          <ThemePreview variant={opt.id as "light" | "dark" | "system"} />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t.settings.preferences.language}</CardTitle>
                <CardDescription>
                  {t.settings.preferences.languageDesc}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="max-w-sm">
                  <Select
                    value={locale}
                    onValueChange={(v) => setLocale(v as "en" | "fr" | "ar")}
                    options={[
                      { label: "English (EN)", value: "en" },
                      { label: "Français (FR)", value: "fr" },
                      { label: "العربية (AR)", value: "ar" },
                    ]}
                  />
                  {locale === "ar" && (
                    <div className="mt-3 inline-flex items-center gap-2 rounded-md border border-[color:var(--color-primary)]/25 bg-[color:var(--color-primary)]/8 px-2.5 py-1.5 text-[11px] font-medium text-[color:var(--color-primary)]">
                      <span className="size-1.5 rounded-full bg-[color:var(--color-primary)]" />
                      <span>{rtlNoticeLabel(locale)}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t.settings.preferences.currency}</CardTitle>
                <CardDescription>
                  {t.settings.preferences.currencyDesc}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="max-w-sm">
                  <Select
                    value={currency}
                    onValueChange={setCurrency}
                    options={[
                      { label: "US Dollar — USD", value: "USD" },
                      { label: "Euro — EUR", value: "EUR" },
                      { label: "CFA Franc (West) — XOF", value: "XOF" },
                      { label: "Nigerian Naira — NGN", value: "NGN" },
                      { label: "South African Rand — ZAR", value: "ZAR" },
                    ]}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>{t.settings.notifications.title}</CardTitle>
              <CardDescription>
                {t.settings.notifications.subtitle}
              </CardDescription>
            </CardHeader>
            <CardContent className="divide-y divide-[color:var(--color-border)] p-0">
              <NotificationRow
                title={t.settings.notifications.orderUpdates}
                description={t.settings.notifications.orderUpdatesDesc}
                defaultChecked
              />
              <NotificationRow
                title={t.settings.notifications.stockAlerts}
                description={t.settings.notifications.stockAlertsDesc}
                defaultChecked
              />
              <NotificationRow
                title={t.settings.notifications.weeklyReport}
                description={t.settings.notifications.weeklyReportDesc}
                defaultChecked
              />
              <NotificationRow
                title={t.settings.notifications.marketing}
                description={t.settings.notifications.marketingDesc}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing">
          <Card>
            <CardHeader>
              <CardTitle>{t.settings.billing.title}</CardTitle>
              <CardDescription>{t.settings.billing.subtitle}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-xl border border-[color:var(--color-border)] bg-gradient-to-br from-[color:var(--color-primary)]/12 via-[color:var(--color-primary)]/5 to-transparent p-4 sm:p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <div className="text-xs font-semibold uppercase tracking-wider text-[color:var(--color-primary)]">
                      {t.settings.billing.currentPlan}
                    </div>
                    <div className="mt-1 text-xl font-semibold">
                      {t.settings.billing.plan}
                    </div>
                    <div className="mt-1 text-sm text-[color:var(--color-muted-foreground)]">
                      {t.settings.billing.planDesc}
                    </div>
                  </div>
                  <Button variant="outline" className="shrink-0">
                    {t.settings.billing.manage}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}

function Field({ label, defaultValue }: { label: string; defaultValue: string }) {
  return (
    <div>
      <Label className="mb-1.5 block">{label}</Label>
      <Input defaultValue={defaultValue} />
    </div>
  );
}

function NotificationRow({
  title,
  description,
  defaultChecked,
}: {
  title: string;
  description: string;
  defaultChecked?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 px-6 py-4">
      <div className="min-w-0">
        <div className="text-sm font-medium">{title}</div>
        <div className="text-xs text-[color:var(--color-muted-foreground)]">
          {description}
        </div>
      </div>
      <Switch defaultChecked={defaultChecked} />
    </div>
  );
}

function ThemePreview({ variant }: { variant: "light" | "dark" | "system" }) {
  const base =
    variant === "dark"
      ? "bg-zinc-900"
      : variant === "system"
      ? "bg-gradient-to-r from-white to-zinc-900"
      : "bg-white";
  return (
    <div className={cn("flex h-full w-full items-center gap-1 p-2", base)}>
      <div className="h-full w-1/4 rounded-sm bg-black/10 dark:bg-white/10" />
      <div className="flex-1 space-y-1">
        <div className="h-1.5 w-3/4 rounded-full bg-black/15 dark:bg-white/20" />
        <div className="h-1.5 w-1/2 rounded-full bg-black/10 dark:bg-white/15" />
        <div className="h-1.5 w-2/3 rounded-full bg-black/10 dark:bg-white/10" />
      </div>
    </div>
  );
}
