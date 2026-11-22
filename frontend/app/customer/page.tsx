"use client";

import { useState } from "react";
import { TokenCard } from "@/components/tokens/TokenCard";

export default function CustomerPortal() {
  const [branchId, setBranchId] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [visitorName, setVisitorName] = useState("");
  const [visitorPhone, setVisitorPhone] = useState("");
  const [token, setToken] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/api/tokens/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          branchId,
          serviceId,
          visitorName,
          visitorPhone,
        }),
      });

      if (!res.ok) throw new Error("Failed to join queue");
      const data = await res.json();
      setToken(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card mb-8">
        <h2 className="text-2xl font-bold mb-6">Join a Queue</h2>
        <form onSubmit={handleJoin} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Branch ID</label>
              <input
                className="input"
                type="text"
                placeholder="e.g. branch-123"
                value={branchId}
                onChange={(e) => setBranchId(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Service ID</label>
              <input
                className="input"
                type="text"
                placeholder="e.g. service-456"
                value={serviceId}
                onChange={(e) => setServiceId(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Your Name</label>
              <input
                className="input"
                type="text"
                placeholder="John Doe"
                value={visitorName}
                onChange={(e) => setVisitorName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone</label>
              <input
                className="input"
                type="tel"
                placeholder="+1 555-000-0000"
                value={visitorPhone}
                onChange={(e) => setVisitorPhone(e.target.value)}
                required
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full disabled:opacity-60"
          >
            {loading ? "Joining..." : "Get Token"}
          </button>
          {error && (
            <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded">{error}</p>
          )}
        </form>
      </div>

      {token && (
        <div className="card bg-blue-50 border-blue-200">
          <h2 className="text-2xl font-bold text-blue-800 mb-4">Your Token</h2>
          <TokenCard token={token} compact />
        </div>
      )}
    </div>
  );
}
