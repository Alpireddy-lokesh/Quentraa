"use client";

import { useEffect, useState } from "react";

export default function PublicDisplay() {
  const [nowServing, setNowServing] = useState<string | null>(null);
  const [counter, setCounter] = useState<string | null>(null);
  const [recent, setRecent] = useState<string[]>([]);

  useEffect(() => {
    // Stub: poll backend for now-serving token
    const timer = setInterval(() => {
      setNowServing("A-101");
      setCounter("Counter 3");
      setRecent(["A-100", "A-99", "A-98"]);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-160px)] flex flex-col items-center justify-center bg-slate-900 text-white p-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-2">Now Serving</h1>
        <div className="text-9xl font-mono font-bold text-blue-400 mb-1">
          {nowServing || "—"}
        </div>
        <div className="text-2xl text-gray-300">
          Counter {counter || "—"}
        </div>
      </div>

      <div className="w-full max-w-md bg-slate-800 rounded-xl p-6 border border-slate-700 shadow-2xl">
        <h3 className="text-gray-400 text-xs uppercase tracking-wider mb-4 font-semibold">
          Recently Called
        </h3>
        <div className="space-y-3">
          {recent.map((t, i) => (
            <div
              key={t}
              className={`flex items-center gap-4 p-3 rounded-lg ${
                i === 0 ? "bg-slate-700 border border-slate-600" : ""
              }`}
            >
              <span className="text-xl font-mono font-bold">{t}</span>
              <span className="ml-auto text-sm text-gray-400">
                Position {i + 1}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
