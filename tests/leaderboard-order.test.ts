import assert from "node:assert/strict";
import test from "node:test";

type Row = { current_streak: number; longest_streak: number; streak_start_date: string };

function rank(rows: Row[]) {
  return [...rows].sort((a, b) => {
    if (b.current_streak !== a.current_streak) return b.current_streak - a.current_streak;
    if (b.longest_streak !== a.longest_streak) return b.longest_streak - a.longest_streak;
    return a.streak_start_date.localeCompare(b.streak_start_date);
  });
}

test("ranking tie-breakers follow spec", () => {
  const ranked = rank([
    { current_streak: 7, longest_streak: 12, streak_start_date: "2026-03-01" },
    { current_streak: 8, longest_streak: 8, streak_start_date: "2026-03-02" },
    { current_streak: 7, longest_streak: 12, streak_start_date: "2026-02-27" },
  ]);
  assert.equal(ranked[0].current_streak, 8);
  assert.equal(ranked[1].streak_start_date, "2026-02-27");
});
