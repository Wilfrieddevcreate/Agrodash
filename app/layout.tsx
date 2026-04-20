import type { Metadata, Viewport } from "next";
import { Poppins, Geist_Mono, Instrument_Serif } from "next/font/google";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { LanguageProvider } from "@/components/providers/language-provider";
import { CurrencyProvider } from "@/components/providers/currency-provider";
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

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://agrodash.example.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "AgroDash — Agribusiness Management Dashboard",
    template: "%s · AgroDash",
  },
  description:
    "A premium, modern agribusiness management dashboard template for crops, inputs, orders, invoices, calendar, kanban and analytics.",
  keywords: [
    "agribusiness",
    "dashboard",
    "saas template",
    "crops",
    "fertilizer",
    "farmers",
    "agriculture",
    "next.js",
    "tailwind",
    "admin template",
  ],
  applicationName: "AgroDash",
  authors: [{ name: "AgroDash Team" }],
  creator: "AgroDash",
  publisher: "AgroDash",
  alternates: {
    canonical: "/",
    languages: {
      en: "/",
      fr: "/",
    },
  },
  openGraph: {
    type: "website",
    siteName: "AgroDash",
    title: "AgroDash — Premium Agribusiness Management Dashboard",
    description:
      "Manage crops, orders, invoices and logistics across every farm from one premium SaaS workspace.",
    url: SITE_URL,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "AgroDash — Agribusiness Management Dashboard",
    description:
      "Premium SaaS dashboard template for agribusiness — Next.js 16, Tailwind 4, React 19.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "technology",
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
      dir="ltr"
      suppressHydrationWarning
      className={`${sans.variable} ${mono.variable} ${display.variable}`}
    >
      <body className={`${sans.className} antialiased`}>
        <ThemeProvider>
          <LanguageProvider>
            <CurrencyProvider>
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
            </CurrencyProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
