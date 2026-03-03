import type { LeaderboardStatus } from "@/lib/types";
import { Flame, Clock, Snowflake } from "lucide-react";

type StatusPillProps =
  | { tierLabel: string; pillClass: string }
  | { status: LeaderboardStatus };

export function StatusPill(props: StatusPillProps) {
  if ("tierLabel" in props) {
    return (
      <span className={`flex w-fit items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${props.pillClass}`}>
        <Flame className="h-3 w-3 fill-current" />
        {props.tierLabel}
      </span>
    );
  }
  const { status } = props;
  if (status === "ACTIVE") {
    return (
      <span className="flex w-fit items-center gap-1.5 rounded-full border border-fire-orange/30 bg-fire-orange/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-fire-orange">
        <Flame className="h-3 w-3 fill-fire-orange text-fire-orange" />
        Hot
      </span>
    );
  }
  if (status === "PENDING") {
    return (
      <span className="flex w-fit items-center gap-1.5 rounded-full border border-fire-yellow/30 bg-fire-yellow/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-fire-yellow">
        <Clock className="h-3 w-3" />
        Warming
      </span>
    );
  }
  return (
    <span className="flex w-fit items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-neutral-200">
      <Snowflake className="h-3 w-3" />
      Cooling
    </span>
  );
}

