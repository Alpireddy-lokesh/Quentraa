"use client";

import { useState } from "react";
import { TokenCard } from "@/components/tokens/TokenCard";

export default function ReceptionistPage() {
  const [branchId, setBranchId] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [visitorName, setVisitorName] = useState("");
  const [visitorPhone, setVisitorPhone] = useState("");
  const [token, setToken] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [recentTokens, setRecentTokens] = useState<any[]>([]);

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${baseUrl}/api/tokens/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ branchId, serviceId, visitorName, visitorPhone }),
      });

      if (!res.ok) throw new Error("Failed to register visitor");
      const data = await res.json();
      setToken(data);
      setRecentTokens((prev) => [data, ...prev].slice(0, 5));

      // Reset form except branch/service
      setVisitorName("");
      setVisitorPhone("");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleCallNext = async () => {
    if (!branchId) {
      setError("Please enter a Branch ID");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}/api/tokens/${branchId}/call-next`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("No waiting tokens");
      const data = await res.json();
      setToken(data);
    } catch (err: any) {
      setError(err.message || "Failed to call next token");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-2xl font-bold mb-2">Receptionist Dashboard</h2>
          <p className="text-gray-600">Register walk-in visitors and manage tokens</p>
        </div>
        <button
          onClick={handleCallNext}
          className="btn-success px-6 py-2"
          disabled={loading || !branchId}
        >
          {loading ? "Calling..." : "Call Next Token"}
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Registration form */}
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Register Visitor</h3>
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Branch ID</label>
                <input
                  className="input"
                  type="text"
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
                  value={serviceId}
                  onChange={(e) => setServiceId(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Visitor Name</label>
                <input
                  className="input"
                  type="text"
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
                  value={visitorPhone}
                  onChange={(e) => setVisitorPhone(e.target.value)}
                  required
                />
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? "Registering..." : "Create Token"}
            </button>
            {error && (
              <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded mt-2">
                {error}
              </p>
            )}
          </form>
        </div>

        {/* Token result */}
        {token && (
          <div className="card bg-blue-50 border-blue-200">
            <h3 className="text-lg font-semibold mb-4">Token Created</h3>
            <TokenCard token={token} compact />
          </div>
        )}

        {/* Recent tokens */}
        <div className="lg:col-span-2 card">
          <h3 className="text-lg font-semibold mb-4">Recent Tokens</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="pb-3 text-sm font-medium text-gray-600">Token</th>
                  <th className="pb-3 text-sm font-medium text-gray-600">Visitor</th>
                  <th className="pb-3 text-sm font-medium text-gray-600">Status</th>
                  <th className="pb-3 text-sm font-medium text-gray-600">Service</th>
                  <th className="pb-3 text-sm font-medium text-gray-600">Created</th>
                </tr>
              </thead>
              <tbody>
                {recentTokens.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-4 text-center text-gray-500">
                      No recent tokens
                    </td>
                  </tr>
                ) : (
                  recentTokens.map((t) => (
                    <tr key={t.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="p-3 font-mono text-sm">{t.tokenNumber}</td>
                      <td className="p-3 text-sm">{t.visitorName}</td>
                      <td className="p-3 text-sm">
                        <span className={`badge ${getBadgeClass(t.status)}`}>
                          {t.status}
                        </span>
                      </td>
                      <td className="p-3 text-sm">{t.serviceId?.slice(-4) ?? "-"}</td>
                      <td className="p-3 text-sm text-gray-500">
                        {new Date(t.createdAt).toLocaleTimeString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function getBadgeClass(status: string): string {
  switch (status) {
    case "WAITING": return "badge-waiting";
    case "CALLED": return "badge-called";
    case "SERVING": return "badge-serving";
    case "COMPLETED": return "badge-completed";
    case "SKIPPED": return "badge-skipped";
    case "CANCELLED": return "badge-cancelled";
    default: return "badge-gray-100 text-gray-600";
  }
}
