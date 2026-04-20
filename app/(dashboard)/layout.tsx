import { Shell } from "@/components/layout/shell";
import { CommandPaletteProvider } from "@/components/command-palette/command-palette-provider";
import { ShortcutsProvider } from "@/components/shortcuts/shortcuts-provider";

export default function DashboardGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CommandPaletteProvider>
      <ShortcutsProvider>
        <Shell>{children}</Shell>
      </ShortcutsProvider>
    </CommandPaletteProvider>
  );
}
