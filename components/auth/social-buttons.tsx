"use client";

import * as React from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useT } from "@/components/providers/language-provider";

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <path
        fill="#EA4335"
        d="M12 10.2v3.9h5.5c-.24 1.4-1.7 4.1-5.5 4.1-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.8 3.4 14.6 2.5 12 2.5 6.7 2.5 2.4 6.8 2.4 12.1S6.7 21.7 12 21.7c6.9 0 9.4-4.8 9.4-7.3 0-.5-.05-.9-.12-1.3H12Z"
      />
      <path
        fill="#34A853"
        d="M3.88 7.38 6.96 9.6c.83-1.6 2.51-2.7 5.04-2.7 1.52 0 2.93.55 4 1.52L18.7 6c-1.64-1.5-3.8-2.5-6.7-2.5-3.65 0-6.78 2.1-8.12 5.38Z"
        opacity="0"
      />
      <path
        fill="#FBBC05"
        d="M12 21.7c2.56 0 4.7-.85 6.26-2.3l-2.98-2.44c-.82.57-1.94.98-3.28.98-2.52 0-4.66-1.7-5.42-4l-3.12 2.4c1.53 3.03 4.68 5.36 8.54 5.36Z"
        opacity="0"
      />
      <path
        fill="#4285F4"
        d="M21.4 12.13c0-.46-.05-.85-.12-1.23H12v3.9h5.5c-.24 1.4-1.7 4.1-5.5 4.1V21.7c6.9 0 9.4-4.8 9.4-9.57Z"
        opacity="0"
      />
    </svg>
  );
}

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
      focusable="false"
      fill="currentColor"
    >
      <path d="M12 .5C5.65.5.5 5.66.5 12.02c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.55v-2.02c-3.2.7-3.87-1.37-3.87-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.2 1.77 1.2 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.3-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.19-3.1-.12-.3-.52-1.48.11-3.08 0 0 .97-.31 3.18 1.18a11 11 0 0 1 2.9-.39c.98 0 1.97.13 2.9.39 2.2-1.49 3.17-1.18 3.17-1.18.63 1.6.23 2.78.11 3.08.74.81 1.19 1.84 1.19 3.1 0 4.43-2.7 5.4-5.26 5.69.41.36.78 1.06.78 2.14v3.17c0 .3.2.66.79.55A11.52 11.52 0 0 0 23.5 12.02C23.5 5.66 18.35.5 12 .5Z" />
    </svg>
  );
}

export function SocialButtons({
  action = "sign in",
}: {
  action?: "sign in" | "sign up";
}) {
  const t = useT();
  function handle(provider: string) {
    const label =
      action === "sign up" ? t.auth.signUp.submit : t.auth.signIn.submit;
    toast(`${provider} · ${label}`, {
      description: t.auth.shared.socialToastDesc,
    });
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      <Button
        type="button"
        variant="outline"
        size="lg"
        onClick={() => handle("Google")}
        className="w-full"
      >
        <GoogleIcon className="size-4" />
        <span>{t.auth.signIn.google}</span>
      </Button>
      <Button
        type="button"
        variant="outline"
        size="lg"
        onClick={() => handle("GitHub")}
        className="w-full"
      >
        <GitHubIcon className="size-4" />
        <span>{t.auth.signIn.github}</span>
      </Button>
    </div>
  );
}
