"use client";

import { TokenDTO } from "@/lib/api";

interface TokenCardProps {
  token: TokenDTO;
  onAction?: (token: TokenDTO) => void;
  compact?: boolean;
}

export default function TokenCard({
  token,
  onAction,
  compact = false,
}: TokenCardProps) {
  const badgeClass = `badge ${getBadgeClass(token.status)}`;

  const statusLabel = {
    WAITING: "Waiting",
    CALLED: "Called",
    SERVING: "Serving",
    COMPLETED: "Completed",
    SKIPPED: "Skipped",
    CANCELLED: "Cancelled",
  }[token.status] ?? token.status;

  return (
    <div className={`card ${compact ? "p-4" : ""} border-l-4 border-blue-500`}>
      <div className={`flex justify-between items-start ${compact ? "gap-2" : "gap-4"}`}>
        <div>
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl font-bold ${compact ? "text-lg" : ""}`}>
              {token.tokenNumber}
            </span>
            <span className={badgeClass}>{statusLabel}</span>
          </div>
          {!compact && token.visitorName && (
            <p className="text-sm text-gray-600 mt-1">{token.visitorName}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {token.counterId && (
            <span className="badge badge-called text-xs bg-blue-100 text-blue-700">
              Counter {token.counterId.slice(-4)}
            </span>
          )}
          {onAction && (
            <button
              onClick={() => onAction(token)}
              className="btn-secondary text-xs px-3 py-1.5"
            >
              Action
            </button>
          )}
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
