"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { useSidebar } from "@/components/providers/sidebar-provider";
import { cn } from "@/lib/utils";

export function Shell({ children }: { children: React.ReactNode }) {
  const { collapsed } = useSidebar();
  const pathname = usePathname();

  return (
    <div className="min-h-screen overflow-x-hidden bg-[color:var(--color-background)]">
      <Sidebar />
      <div
        className={cn(
          "flex min-h-screen min-w-0 flex-col transition-[padding] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
          // `ps-*` is padding-inline-start — flips with direction so the
          // content never overlaps the sidebar in RTL.
          collapsed ? "lg:ps-[80px]" : "lg:ps-[260px]"
        )}
      >
        <Header />
        <main className="min-w-0 flex-1">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto w-full min-w-0 max-w-[1400px] px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
