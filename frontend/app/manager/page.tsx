"use client";

import { useState } from "react";

export default function ManagerPage() {
  const [branchId, setBranchId] = useState("");

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Branch Manager Dashboard</h2>
      <p className="text-gray-600 mb-8">
        Manage branches, departments, services, counters, staff, and view reports.
      </p>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Branch Overview</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-xs text-gray-500 uppercase">Active Branches</p>
              <p className="text-2xl font-bold">{branchId || "—"}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <p className="text-xs text-gray-500 uppercase">Waiting Tokens</p>
              <p className="text-2xl font-bold">0</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-xs text-gray-500 uppercase">Called Today</p>
              <p className="text-2xl font-bold">0</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <p className="text-xs text-gray-500 uppercase">Completed</p>
              <p className="text-2xl font-bold">0</p>
            </div>
          </div>
        </div>

        <div className="card lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4">Queue Status by Service</h3>
          <div className="bg-gray-50 p-4 rounded-lg text-center text-gray-500">
            Configure branches and services in the backend to view live stats.
          </div>
        </div>
      </div>

      <div className="card mt-8">
        <h3 className="text-lg font-semibold mb-4">Branch ID (for API calls)</h3>
        <input
          className="input w-64 mb-4"
          type="text"
          placeholder="Enter branch ID"
          value={branchId}
          onChange={(e) => setBranchId(e.target.value)}
        />
        <p className="text-sm text-gray-500">
          Use this branch ID in Receptionist and Counter dashboards.
        </p>
      </div>
    </div>
  );
}
