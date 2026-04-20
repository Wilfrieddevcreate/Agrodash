import type { Metadata, Viewport } from "next";
import { Poppins, Geist_Mono, Instrument_Serif } from "next/font/google";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { LanguageProvider } from "@/components/providers/language-provider";
import { SidebarProvider } from "@/components/providers/sidebar-provider";
import "./globals.css";

const sans = Poppins({
  variable: "--font-sans-next",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const mono = Geist_Mono({
  variable: "--font-mono-next",
  subsets: ["latin"],
  display: "swap",
});

const display = Instrument_Serif({
  variable: "--font-display-next",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "AgroDash — Agribusiness Management Dashboard",
    template: "%s · AgroDash",
  },
  description:
    "A premium, modern agribusiness management dashboard template for crops, inputs, orders and customers.",
  keywords: [
    "agribusiness",
    "dashboard",
    "saas template",
    "crops",
    "fertilizer",
    "farmers",
    "agriculture",
  ],
  applicationName: "AgroDash",
  authors: [{ name: "AgroDash Team" }],
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafcfa" },
    { media: "(prefers-color-scheme: dark)", color: "#0f1512" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${sans.variable} ${mono.variable} ${display.variable}`}
    >
      <body className={`${sans.className} antialiased`}>
        <ThemeProvider>
          <LanguageProvider>
            <SidebarProvider>
              {children}
              <Toaster
                position="bottom-right"
                toastOptions={{
                  classNames: {
                    toast:
                      "!bg-[color:var(--color-card)] !text-[color:var(--color-foreground)] !border-[color:var(--color-border)] !shadow-lg",
                    description: "!text-[color:var(--color-muted-foreground)]",
                  },
                }}
              />
            </SidebarProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
