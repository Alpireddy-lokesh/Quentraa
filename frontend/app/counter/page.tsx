"use client";

import { useState, useEffect } from "react";
import { TokenCard } from "@/components/tokens/TokenCard";

export default function CounterPage() {
  const [branchId, setBranchId] = useState("");
  const [queue, setQueue] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

  useEffect(() => {
    if (!branchId) return;
    loadQueue();
  }, [branchId]);

  const loadQueue = async () => {
    try {
      const res = await fetch(`${baseUrl}/api/tokens?branchId=${branchId}&status=WAITING`);
      if (!res.ok) throw new Error("Failed to load queue");
      const data = await res.json();
      setQueue(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.message || "Failed to load queue");
    }
  };

  const handleCallNext = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}/api/tokens/${branchId}/call-next`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("No waiting tokens");
      const data = await res.json();
      setQueue((prev) => [data, ...prev.filter((t) => t.id !== data.id)]);
    } catch (err: any) {
      setError(err.message || "Failed to call next");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold mb-2">Counter Staff Dashboard</h2>
          <p className="text-gray-600">Manage the live queue at your counter</p>
        </div>
        <div className="flex items-center gap-3">
          <input
            className="input w-48"
            type="text"
            placeholder="Branch ID"
            value={branchId}
            onChange={(e) => setBranchId(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-4 mb-8">
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Waiting Queue</h3>
          <button
            onClick={handleCallNext}
            disabled={loading || branchId === ""}
            className="btn-success w-full py-3 disabled:opacity-50"
          >
            {loading ? "Calling..." : "Call Next Token →"}
          </button>
          {queue.length === 0 && (
            <p className="mt-4 text-center text-gray-500">No waiting tokens</p>
          )}
        </div>
        {error && (
          <div className="card bg-red-50 border-red-200 p-4">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Tokens in Queue</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="pb-3 text-sm font-medium text-gray-600">Token</th>
                <th className="pb-3 text-sm font-medium text-gray-600">Visitor</th>
                <th className="pb-3 text-sm font-medium text-gray-600">Service</th>
                <th className="pb-3 text-sm font-medium text-gray-600">Wait Position</th>
              </tr>
            </thead>
            <tbody>
              {queue.map((t) => (
                <tr key={t.id} className="border-b border-gray-100">
                  <td className="p-3 font-mono text-sm">{t.tokenNumber}</td>
                  <td className="p-3 text-sm">{t.visitorName}</td>
                  <td className="p-3 text-sm">{t.serviceId?.slice(-4) ?? "-"}</td>
                  <td className="p-3 text-sm">{queue.indexOf(t) + 1}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
