"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

export function ReviewActions({ checkinId, username }: { checkinId: string; username: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState<"APPROVE" | "REJECT" | null>(null);
  const [toast, setToast] = useState<"approved" | "rejected" | null>(null);

  async function submit(action: "APPROVE" | "REJECT") {
    setLoading(action);
    setToast(null);
    try {
      const res = await fetch("/api/cs/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ checkinId, action }),
      });
      if (!res.ok) {
        setToast(null);
        return;
      }
      setToast(action === "APPROVE" ? "approved" : "rejected");
      router.refresh();
      setTimeout(() => setToast(null), 3000);
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="flex flex-col items-end gap-2">
      {toast && (
        <div
          className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium ${
            toast === "approved"
              ? "bg-emerald-500/20 text-emerald-400"
              : "bg-fire-red/20 text-fire-red"
          }`}
        >
          {toast === "approved" ? (
            <CheckCircle className="h-3.5 w-3.5" />
          ) : (
            <XCircle className="h-3.5 w-3.5" />
          )}
          {toast === "approved" ? `Approved ${username}` : `Rejected ${username}`}
        </div>
      )}
      <div className="flex gap-2">
        <button onClick={() => submit("APPROVE")} disabled={!!loading} className="flex w-20 items-center justify-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1 text-sm text-emerald-400 disabled:opacity-60 hover:bg-emerald-500/20 transition">
          {loading === "APPROVE" ? <Loader2 className="h-3 w-3 animate-spin" /> : null}
          Approve
        </button>
        <button onClick={() => submit("REJECT")} disabled={!!loading} className="flex w-20 items-center justify-center gap-1 rounded-full border border-fire-red/30 bg-fire-red/10 px-4 py-1 text-sm text-fire-red disabled:opacity-60 hover:bg-fire-red/20 transition">
          {loading === "REJECT" ? <Loader2 className="h-3 w-3 animate-spin" /> : null}
          Reject
        </button>
      </div>
    </div>
  );
}
