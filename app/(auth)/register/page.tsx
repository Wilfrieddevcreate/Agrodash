import type { Metadata } from "next";
import { RegisterForm } from "./register-form";

export const metadata: Metadata = {
  title: "Create your workspace",
  description: "Start managing your agribusiness with AgroDash.",
};

export default function Page() {
  return <RegisterForm />;
}
