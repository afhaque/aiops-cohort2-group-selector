"use client";

import type { Group } from "@/lib/types";

interface GroupCardProps {
  group: Group;
  onSelect: (group: Group) => void;
}

const SECTOR_ICONS: Record<string, string> = {
  "Operations & Automation": "⚙️",
  "Strategy & Leadership": "🌟",
  "Marketing & Brand": "📣",
  "Security & Compliance": "🛡️",
  "Finance & FinTech": "💰",
  "Sales & Revenue": "🎯",
  "Customer Success": "🤝",
  "Education & Training": "🎓",
  "Healthcare & Wellness": "❤️",
  "Sustainability & CleanTech": "🌱",
};

export default function GroupCard({ group, onSelect }: GroupCardProps) {
  const spotsLeft = group.max_members - group.member_count;
  const isFull = spotsLeft <= 0;
  const icon = SECTOR_ICONS[group.sector] ?? "🤖";

  return (
    <div
      className={`relative flex flex-col rounded-xl border border-brand-border bg-brand-card p-5 transition-all duration-200 ${
        isFull
          ? "opacity-50 cursor-not-allowed"
          : "hover:border-brand-purple hover:shadow-lg hover:shadow-purple-900/30 cursor-pointer"
      }`}
      onClick={() => !isFull && onSelect(group)}
    >
      {isFull && (
        <span className="absolute top-3 right-3 rounded-full bg-gray-700 px-2 py-0.5 text-xs font-medium text-gray-400">
          Full
        </span>
      )}

      <div className="mb-3 text-2xl">{icon}</div>

      <div className="mb-1 text-xs font-semibold uppercase tracking-widest text-brand-purple">
        {group.sector}
      </div>

      <div className="mb-2 font-mono text-sm text-gray-400">
        #{group.channel_name}
      </div>

      <p className="mb-4 flex-1 text-sm leading-relaxed text-gray-300">
        {group.description}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex gap-1">
          {Array.from({ length: group.max_members }).map((_, i) => (
            <div
              key={i}
              className={`h-2 w-2 rounded-full ${
                i < group.member_count ? "bg-brand-purple" : "bg-gray-700"
              }`}
            />
          ))}
        </div>
        <span
          className={`text-xs font-medium ${
            spotsLeft <= 1 ? "text-amber-400" : "text-gray-400"
          }`}
        >
          {isFull ? "No spots left" : `${spotsLeft} of ${group.max_members} spots left`}
        </span>
      </div>
    </div>
  );
}
