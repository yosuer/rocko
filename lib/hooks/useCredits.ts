'use client';

import { useState, useCallback } from 'react';
import type { Transaction } from '@/lib/types';

export function useCredits() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/credits');
      if (res.ok) {
        const data: Transaction[] = await res.json();
        setTransactions(data);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  return { transactions, loading, fetchHistory };
}
