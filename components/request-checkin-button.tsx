"use client";

import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";

export function RequestCheckInButton() {
  const { pending } = useFormStatus();
  return (
    <button
      disabled={pending}
      className="w-full rounded-full bg-gradient-to-r from-fire-red to-fire-orange py-4 text-center font-bold text-white transition hover:scale-[1.02] disabled:scale-100 disabled:opacity-70 flex items-center justify-center gap-2"
      type="submit"
    >
      {pending ? (
        <>
          <Loader2 className="h-5 w-5 animate-spin" />
          Requesting…
        </>
      ) : (
        "Request Check-In"
      )}
    </button>
  );
}
