"use client";

import { useEffect, useRef, useState } from "react";
import type { Group } from "@/lib/types";

interface SignupModalProps {
  group: Group;
  onClose: () => void;
  onSuccess: () => void;
}

const INPUT_CLASS =
  "w-full rounded-lg border border-brand-border bg-brand-dark px-4 py-2.5 text-white placeholder-gray-600 outline-none focus:border-brand-purple focus:ring-1 focus:ring-brand-purple";

export default function SignupModal({ group, onClose, onSuccess }: SignupModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const spotsLeft = group.max_members - group.member_count;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, group_id: group.id }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }

      setSuccess(data.message);
      timerRef.current = setTimeout(() => {
        onSuccess();
        onClose();
      }, 2000);
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-md rounded-2xl border border-brand-border bg-brand-card p-6 shadow-2xl">
        <div className="mb-5">
          <div className="mb-1 text-xs font-semibold uppercase tracking-widest text-brand-purple">
            Joining
          </div>
          <h2 className="text-xl font-bold text-white">{group.sector}</h2>
          <p className="mt-1 font-mono text-sm text-gray-400">#{group.channel_name}</p>
          <p className="mt-1 text-xs text-gray-500">{spotsLeft} spot{spotsLeft !== 1 ? "s" : ""} remaining</p>
        </div>

        {success ? (
          <div className="rounded-lg border border-green-700 bg-green-900/30 p-4 text-center">
            <div className="mb-1 text-2xl">✅</div>
            <p className="font-medium text-green-400">{success}</p>
            <p className="mt-1 text-sm text-gray-400">Closing in a moment...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-300">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className={INPUT_CLASS}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-300">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className={INPUT_CLASS}
              />
            </div>

            {error && (
              <div className="rounded-lg border border-red-800 bg-red-900/30 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded-lg border border-brand-border py-2.5 text-sm font-medium text-gray-400 transition hover:border-gray-500 hover:text-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 rounded-lg bg-brand-purple py-2.5 text-sm font-semibold text-white transition hover:bg-purple-500 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Joining..." : "Join Group"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
