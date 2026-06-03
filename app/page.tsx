"use client";

import { useCallback, useEffect, useState } from "react";
import GroupCard from "@/components/GroupCard";
import SignupModal from "@/components/SignupModal";
import type { Group } from "@/lib/types";

const GRID_CLASS = "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

export default function HomePage() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);

  const fetchGroups = useCallback(async () => {
    try {
      const res = await fetch("/api/groups", { cache: "no-store" });
      const data = await res.json();
      setGroups(data.groups ?? []);
    } catch {
      // silently retry on next refresh
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  const { totalSignups, totalSpots } = groups.reduce(
    (acc, g) => ({
      totalSignups: acc.totalSignups + g.member_count,
      totalSpots: acc.totalSpots + g.max_members,
    }),
    { totalSignups: 0, totalSpots: 0 }
  );

  return (
    <main className="min-h-screen bg-brand-dark">
      {/* Header */}
      <header className="border-b border-brand-border bg-brand-card/60 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-4 py-5">
          <div className="flex flex-col items-start gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-xs font-semibold uppercase tracking-widest text-brand-purple">
                Overclock Accelerator
              </div>
              <h1 className="mt-0.5 text-2xl font-bold text-white">
                AI Ops Cohort 2 — Huddle Groups
              </h1>
            </div>
            {!loading && (
              <div className="text-right text-sm text-gray-500">
                <span className="font-semibold text-white">{totalSignups}</span>
                <span className="text-gray-500"> / {totalSpots} students placed</span>
              </div>
            )}
          </div>
          <p className="mt-2 max-w-xl text-sm text-gray-400">
            Choose the sector that best matches the AI project you want to build.
            Each group has up to 5 members and meets weekly to build together.
          </p>
        </div>
      </header>

      {/* Grid */}
      <section className="mx-auto max-w-6xl px-4 py-10">
        <div className={GRID_CLASS}>
          {loading
            ? Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className="h-56 animate-pulse rounded-xl border border-brand-border bg-brand-card"
                />
              ))
            : groups.map((group) => (
                <GroupCard key={group.id} group={group} onSelect={setSelectedGroup} />
              ))}
        </div>

        {!loading && groups.length === 0 && (
          <div className="py-20 text-center text-gray-500">
            <p className="text-lg">Groups are loading&hellip;</p>
            <p className="mt-2 text-sm">If this persists, contact your program coordinator.</p>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="border-t border-brand-border py-6 text-center text-xs text-gray-600">
        Overclock Accelerator · AI Ops Cohort 2 · Huddle Group Selector
      </footer>

      {/* Signup Modal */}
      {selectedGroup && (
        <SignupModal
          group={selectedGroup}
          onClose={() => setSelectedGroup(null)}
          onSuccess={fetchGroups}
        />
      )}
    </main>
  );
}
