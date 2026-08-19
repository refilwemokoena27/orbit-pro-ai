import { useEffect, useRef } from "react";

type Options = {
  key: string;
  meta?: boolean; // Cmd (mac) / Ctrl (win)
  shift?: boolean;
  enabled?: boolean;
};

export function useHotkey(handler: () => void, { key, meta, shift, enabled = true }: Options) {
  const ref = useRef(handler);
  ref.current = handler;

  useEffect(() => {
    if (!enabled) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() !== key.toLowerCase()) return;
      if (meta && !(e.metaKey || e.ctrlKey)) return;
      if (!meta && (e.metaKey || e.ctrlKey)) return;
      if (shift && !e.shiftKey) return;
      if (!shift && e.shiftKey) return;
      e.preventDefault();
      ref.current();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [key, meta, shift, enabled]);
}

export function useIsMac() {
  const ref = useRef(false);
  if (typeof navigator !== "undefined") {
    ref.current = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
  }
  return ref.current;
}

export function modKeyLabel() {
  if (typeof navigator === "undefined") return "Ctrl";
  return /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent) ? "⌘" : "Ctrl";
}
