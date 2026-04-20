import type { Metadata } from "next";
import { ForgotPasswordForm } from "./forgot-password-form";

export const metadata: Metadata = {
  title: "Reset your password",
  description: "Send a secure password reset link to your inbox.",
};

export default function Page() {
  return <ForgotPasswordForm />;
}
