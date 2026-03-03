"use client";

import { useLinkStatus } from "next/link";
import { Loader2 } from "lucide-react";

export function LinkSpinner({ className = "" }: { className?: string }) {
  const { pending } = useLinkStatus();
  if (!pending) return null;
  return <Loader2 className={`inline h-3.5 w-3.5 animate-spin ${className}`} aria-hidden />;
}
