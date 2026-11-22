"use client";

import { useEffect, useState } from "react";
import { getStompClient } from "@/lib/ws";

export default function PublicDisplay() {
  const [branchId, setBranchId] = useState("");
  const [nowServing, setNowServing] = useState<string | null>(null);
  const [counter, setCounter] = useState<string | null>(null);
  const [recent, setRecent] = useState<string[]>([]);
  const [connected, setConnected] = useState(false);

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

  useEffect(() => {
    const client = getStompClient();
    client.connect();
    client.subscribe("/topic/queue/display", (frame) => {
      try {
        const data = JSON.parse(frame.body);
        if (data.tokenNumber) setNowServing(data.tokenNumber);
        if (data.counterId) setCounter("Counter " + data.counterId.slice(-4));
        if (Array.isArray(data.recent)) setRecent(data.recent);
      } catch (e) {
        // ignore parse errors
      }
    });
    setConnected(client.isConnected());
    return () => {
      client.unsubscribe("/topic/queue/display");
    };
  }, []);

  // Fallback demo data if no WebSocket messages arrive
  useEffect(() => {
    if (!connected && nowServing === null) {
      const timer = setInterval(() => {
        setNowServing("A-101");
        setCounter("Counter 3");
        setRecent(["A-100", "A-99", "A-98"]);
      }, 3000);
      return () => clearInterval(timer);
    }
  }, [connected, nowServing]);

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-160px)] flex flex-col items-center justify-center bg-slate-900 text-white p-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-2">Now Serving</h1>
        <div className={`text-9xl font-mono font-bold mb-1 ${nowServing ? "text-blue-400" : "text-slate-600"}`}>
          {nowServing || "—"}
        </div>
        <div className="text-2xl text-gray-300">
          Counter {counter || "—"}
        </div>
        {!connected && (
          <p className="mt-4 text-sm text-slate-400">Live mode: waiting for WebSocket…</p>
        )}
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
