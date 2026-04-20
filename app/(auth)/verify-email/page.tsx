import type { Metadata } from "next";
import { VerifyEmailForm } from "./verify-email-form";

export const metadata: Metadata = {
  title: "Verify your email",
  description: "Enter the 6-digit code we sent to your inbox.",
};

export default function Page() {
  return <VerifyEmailForm />;
}
