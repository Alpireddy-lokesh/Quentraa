"use client";

import { TokenDTO } from "@/lib/api";
import TokenCard from "./TokenCard";

interface TokenListProps {
  tokens: TokenDTO[];
  onAction?: (token: TokenDTO) => void;
}

export default function TokenList({ tokens, onAction }: TokenListProps) {
  if (tokens.length === 0) {
    return (
      <div className="card text-center py-12">
        <p className="text-gray-500">No tokens found.</p>
      </div>
    );
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {tokens.map((token) => (
        <TokenCard key={token.id} token={token} onAction={onAction} />
      ))}
    </div>
  );
}
