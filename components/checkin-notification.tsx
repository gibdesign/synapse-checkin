"use client";

import { useState } from "react";
import { Flame, ShieldAlert, X, Clock } from "lucide-react";

export function CheckinNotification({
  approved,
  rejectionReason,
  pending,
}: {
  approved?: boolean;
  rejectionReason?: string | null;
  pending?: boolean;
}) {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  if (pending) {
    return (
      <div className="mb-6 flex items-center justify-between gap-3 rounded-2xl border border-fire-yellow/30 bg-fire-yellow/10 px-4 py-3">
        <div className="flex items-center gap-3">
          <Clock className="h-5 w-5 text-fire-yellow" />
          <div>
            <p className="font-semibold text-fire-yellow">Request in queue</p>
            <p className="text-sm text-neutral-300">Customer Service is reviewing your check-in.</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="rounded-full p-1 text-neutral-400 hover:text-white transition"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  if (approved === true) {
    return (
      <div className="mb-6 flex items-center justify-between gap-3 rounded-2xl border border-fire-orange/30 bg-fire-orange/10 px-4 py-3">
        <div className="flex items-center gap-3">
          <Flame className="h-5 w-5 animate-pulse text-fire-orange" />
          <div>
            <p className="font-semibold text-fire-orange">Check-in approved!</p>
            <p className="text-sm text-neutral-300">Your streak is on fire.</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="rounded-full p-1 text-neutral-400 hover:text-white transition"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="mb-6 flex items-center justify-between gap-3 rounded-2xl border border-fire-red/30 bg-fire-red/10 px-4 py-3">
      <div className="flex items-center gap-3">
        <ShieldAlert className="h-5 w-5 text-fire-red" />
        <div>
          <p className="font-semibold text-fire-red">Check-in rejected</p>
          <p className="text-sm text-neutral-300">
            {rejectionReason ? `${rejectionReason} ` : "Your check-in was declined. "}
            You can request again.
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        className="rounded-full p-1 text-neutral-400 hover:text-white transition"
        aria-label="Dismiss"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
