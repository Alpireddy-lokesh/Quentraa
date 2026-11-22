"use client";

import { useEffect, useState } from "react";
import TokenCard from "@/components/tokens/TokenCard";
import { getStompClient } from "@/lib/ws";
import QRCode from "react-qr-code";

export default function CustomerPortal() {
  const [branchId, setBranchId] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [visitorName, setVisitorName] = useState("");
  const [visitorPhone, setVisitorPhone] = useState("");
  const [token, setToken] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [scanning, setScanning] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

  /** Scan QR code: reads the data from the QR scanner and parses it */
  const handleScan = (text: string) => {
    // Expected format: branchId-serviceId-visitorName-visitorPhone
    const parts = text.split("-");
    if (parts.length === 4) {
      setBranchId(parts[0]);
      setServiceId(parts[1]);
      setVisitorName(parts[2]);
      setVisitorPhone(parts[3]);
      setScanning(false);
    } else {
      setError("Invalid QR code format");
    }
  };

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${baseUrl}/api/tokens/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ branchId, serviceId, visitorName, visitorPhone }),
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

  useEffect(() => {
    if (!branchId) return;
    const client = getStompClient();
    client.connect();
    client.subscribe(`/topic/queue/${branchId}`, (frame) => {
      try {
        const updated = JSON.parse(frame.body);
        if (updated.id && token && updated.id === token.id) {
          setToken(updated);
        }
      } catch (e) {
        // ignore parse errors
      }
    });
    return () => {
      client.unsubscribe(`/topic/queue/${branchId}`);
    };
  }, [branchId, token]);

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Join a Queue</h2>

      {/* QR Code Scanner Section */}
      {scanning ? (
        <div className="card mb-8">
          <h3 className="text-lg font-semibold mb-4">Scan QR Code</h3>
          <QRCode
            value={qrCode || ""}
            onError={(error) => setError("Failed to read QR code")}
            size={256}
          />
          <p className="mt-3 text-sm text-gray-500">
            Align the QR code within the frame
          </p>
        </div>
      ) : (
        <div className="card mb-8">
          <h3 className="text-lg font-semibold mb-4">Scan QR to Join</h3>
          <p className="text-gray-600 mb-4">
            Scan the QR code below with your camera to join the queue instantly.
          </p>
          <button
            onClick={() => setScanning(true)}
            className="btn-secondary w-full py-2 mb-3"
          >
            Scan QR Code
          </button>
        </div>
      )}

      {/* Manual form */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Or Join Manually</h3>
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
            <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded mt-2">
              {error}
            </p>
          )}
        </form>
      </div>

      {token && (
        <div className="card bg-blue-50 border-blue-200 mt-8">
          <h2 className="text-2xl font-bold text-blue-800 mb-4">Your Token</h2>
          <TokenCard token={token} compact />
        </div>
      )}
    </div>
  );
}