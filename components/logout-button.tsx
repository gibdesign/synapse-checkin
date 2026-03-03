"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export function LogoutButton({ className = "" }: { className?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onLogout() {
    setLoading(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/");
      router.refresh();
      // Keep loading visible until navigation completes
    } catch {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={onLogout}
      disabled={loading}
      className={className || "rounded-full border border-white/20 px-4 py-2 text-sm font-semibold"}
    >
      {loading ? (
        <>
          <Loader2 className="inline h-3.5 w-3.5 animate-spin" /> <span className="hidden sm:inline">Logging out…</span>
        </>
      ) : (
        "Logout"
      )}
    </button>
  );
}
