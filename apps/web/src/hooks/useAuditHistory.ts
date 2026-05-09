"use client";

import { useState, useEffect } from "react";

type HistoryEntry = {
  slug: string;
  companyName?: string;
  totalMonthlySpend: number;
  estimatedSavings: number;
  createdAt: string;
};

const STORAGE_KEY = "ai_audit_history";
const MAX_ENTRIES = 5;

export function useAuditHistory() {
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setHistory(JSON.parse(stored));
    } catch {}
  }, []);

  const addEntry = (entry: HistoryEntry) => {
    setHistory((prev) => {
      const filtered = prev.filter((e) => e.slug !== entry.slug);
      const updated = [entry, ...filtered].slice(0, MAX_ENTRIES);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const clearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {}
  };

  return { history, addEntry, clearHistory };
}
