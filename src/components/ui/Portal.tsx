"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

/* Page content lives inside a transformed <main> (the route transition), and
   a transform creates a stacking context — so any overlay rendered from a
   page would be trapped beneath the fixed header no matter its z-index.
   Anything full-screen goes through here instead. */

export function Portal({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return createPortal(children, document.body);
}
