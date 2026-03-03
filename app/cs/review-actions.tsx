"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export function ReviewActions({ checkinId }: { checkinId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState<"APPROVE" | "REJECT" | null>(null);

  async function submit(action: "APPROVE" | "REJECT") {
    setLoading(action);
    try {
      await fetch("/api/cs/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ checkinId, action }),
      });
      router.refresh();
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="flex gap-2">
      <button onClick={() => submit("APPROVE")} disabled={!!loading} className="flex w-20 items-center justify-center gap-1 rounded-full border border-white/10 px-4 py-1 text-sm disabled:opacity-60">
        {loading === "APPROVE" ? <Loader2 className="h-3 w-3 animate-spin" /> : null}
        Approve
      </button>
      <button onClick={() => submit("REJECT")} disabled={!!loading} className="flex w-20 items-center justify-center gap-1 rounded-full border border-white/10 px-4 py-1 text-sm disabled:opacity-60">
        {loading === "REJECT" ? <Loader2 className="h-3 w-3 animate-spin" /> : null}
        Reject
      </button>
    </div>
  );
}
