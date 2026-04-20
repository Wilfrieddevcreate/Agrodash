"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { AuthCard } from "@/components/auth/auth-card";

export function ForgotPasswordForm() {
  const [email, setEmail] = React.useState("");
  const [submitted, setSubmitted] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);
    window.setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      toast.success("Reset link sent", {
        description: `Check ${email} for instructions.`,
      });
    }, 500);
  }

  return (
    <div className="w-full max-w-sm">
      <AnimatePresence mode="wait" initial={false}>
        {!submitted ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <AuthCard
              title="Reset your password"
              description="We'll email you a secure reset link"
              footer={
                <>
                  Remembered it?{" "}
                  <Link
                    href="/login"
                    className="font-semibold text-[color:var(--color-foreground)] underline-offset-4 hover:underline"
                  >
                    Back to sign in
                  </Link>
                </>
              }
            >
              <form
                onSubmit={handleSubmit}
                className="space-y-5"
                noValidate
              >
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

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full"
                  disabled={submitting}
                >
                  {submitting ? "Sending..." : "Send reset link"}
                  <ArrowRight className="size-4" />
                </Button>
              </form>
            </AuthCard>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-6 text-center"
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                delay: 0.08,
                duration: 0.4,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="mx-auto grid size-16 place-items-center rounded-full bg-[color:var(--color-success)]/12 ring-8 ring-[color:var(--color-success)]/6"
            >
              <CheckCircle2
                className="size-8 text-[color:var(--color-success)]"
                strokeWidth={2}
              />
            </motion.div>

            <div className="space-y-1.5">
              <h1 className="text-[22px] font-semibold tracking-[-0.02em] text-[color:var(--color-foreground)]">
                Check your inbox
              </h1>
              <p className="text-sm leading-relaxed text-[color:var(--color-muted-foreground)]">
                We sent instructions to{" "}
                <span className="font-medium text-[color:var(--color-foreground)]">
                  {email}
                </span>
                . The link will expire in 30 minutes.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <Link
                href="/login"
                className={buttonVariants({
                  variant: "outline",
                  size: "lg",
                  className: "w-full",
                })}
              >
                <ArrowLeft className="size-4" />
                Back to sign in
              </Link>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                }}
                className="text-[12.5px] font-medium text-[color:var(--color-muted-foreground)] underline-offset-4 transition-colors hover:text-[color:var(--color-foreground)] hover:underline"
              >
                Didn&apos;t get it? Try a different email
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
