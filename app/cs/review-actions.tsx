"use client";

import { useRouter } from "next/navigation";

export function ReviewActions({ checkinId }: { checkinId: string }) {
  const router = useRouter();

  async function submit(action: "APPROVE" | "REJECT") {
    await fetch("/api/cs/review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ checkinId, action }),
    });
    router.refresh();
  }

  return (
    <div className="flex gap-2">
      <button onClick={() => submit("APPROVE")} className="rounded-full border border-white/10 px-4 py-1 text-sm">Approve</button>
      <button onClick={() => submit("REJECT")} className="rounded-full border border-white/10 px-4 py-1 text-sm">Reject</button>
    </div>
  );
}
