"use client";

import { useState, useMemo } from "react";
import { ChevronDown, ChevronUp, ArrowUpDown } from "lucide-react";

type Row = {
  id: string;
  requestDate: Date;
  status: string;
  reviewedBy: { username: string } | null;
  reviewTime: Date | null;
  note: string | null;
  rejectionReason: string | null;
};

type SortKey = "date" | "status" | "reviewer";

function SortHeader({
  label,
  sortKey,
  sort,
  onSort,
}: {
  label: string;
  sortKey: SortKey;
  sort: { key: SortKey; asc: boolean };
  onSort: (key: SortKey, asc: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSort(sortKey, sort.key === sortKey ? !sort.asc : true)}
      className="flex items-center gap-0.5 text-xs uppercase tracking-[0.2em] text-neutral-400 hover:text-white transition"
    >
      {label}
      {sort.key === sortKey ? (
        sort.asc ? <ChevronUp className="h-3 w-3 ml-0.5" /> : <ChevronDown className="h-3 w-3 ml-0.5" />
      ) : (
        <ArrowUpDown className="h-3 w-3 ml-0.5 opacity-50" />
      )}
    </button>
  );
}

export function SortableCheckinsTable({ rows }: { rows: Row[] }) {
  const [sort, setSort] = useState<{ key: SortKey; asc: boolean }>({ key: "date", asc: false });

  const sorted = useMemo(() => {
    const arr = rows.map((r) => ({
      ...r,
      requestDate: new Date(r.requestDate),
      reviewTime: r.reviewTime ? new Date(r.reviewTime) : null,
    }));
    arr.sort((a, b) => {
      let cmp = 0;
      switch (sort.key) {
        case "date":
          cmp = a.requestDate.getTime() - b.requestDate.getTime();
          break;
        case "status":
          cmp = a.status.localeCompare(b.status);
          break;
        case "reviewer":
          cmp = (a.reviewedBy?.username ?? "").localeCompare(b.reviewedBy?.username ?? "");
          break;
        default:
          return 0;
      }
      return sort.asc ? cmp : -cmp;
    });
    return arr;
  }, [rows, sort]);

  return (
    <div className="mt-8 overflow-x-auto rounded-3xl border border-white/10">
      <div className="flex flex-wrap items-center gap-4 rounded-t-3xl border-b border-white/10 bg-white/5 px-4 py-3">
        <span className="text-xs text-neutral-500">Sort by:</span>
        <SortHeader label="Date" sortKey="date" sort={sort} onSort={(key, asc) => setSort({ key, asc })} />
        <SortHeader label="Status" sortKey="status" sort={sort} onSort={(key, asc) => setSort({ key, asc })} />
        <SortHeader label="Reviewer" sortKey="reviewer" sort={sort} onSort={(key, asc) => setSort({ key, asc })} />
      </div>
      <table className="min-w-full text-left text-sm">
        <thead className="bg-white/5 text-xs uppercase tracking-[0.2em] text-neutral-400">
          <tr>
            <th className="p-4">Date</th>
            <th>Status</th>
            <th>Reviewed By</th>
            <th>Review Time</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((row) => (
            <tr key={row.id} className="border-t border-white/5">
              <td className="p-4">{row.requestDate.toLocaleString()}</td>
              <td>{row.status}</td>
              <td>{row.reviewedBy?.username ?? "-"}</td>
              <td>{row.reviewTime ? row.reviewTime.toLocaleString() : "-"}</td>
              <td>{row.note || row.rejectionReason || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
