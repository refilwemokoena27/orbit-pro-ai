import { useEffect, useState } from "react";

export function Kbd({ combo }: { combo: string }) {
  // combo uses "Mod" as placeholder for Cmd/Ctrl
  const [mod, setMod] = useState("Ctrl");

  useEffect(() => {
    const isMac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
    setMod(isMac ? "⌘" : "Ctrl");
  }, []);

  return (
    <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] font-medium text-muted-foreground">
      {combo.replace("Mod", mod)}
    </kbd>
  );
}
