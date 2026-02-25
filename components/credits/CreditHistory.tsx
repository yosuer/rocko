'use client';

import { useEffect } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { useCredits } from '@/lib/hooks/useCredits';
import type { Transaction } from '@/lib/types';

interface CreditHistoryProps {
  open: boolean;
  onClose: () => void;
}

const TYPE_LABELS: Record<Transaction['type'], { label: string; sign: string; colorClass: string }> = {
  purchase: { label: 'Compra', sign: '+', colorClass: 'text-primary' },
  spend: { label: 'Gasto', sign: '-', colorClass: 'text-accent' },
  admin_credit: { label: 'Recarga admin', sign: '+', colorClass: 'text-primary' },
  refund: { label: 'Reembolso', sign: '+', colorClass: 'text-primary' },
};

export function CreditHistory({ open, onClose }: CreditHistoryProps) {
  const { transactions, loading, fetchHistory } = useCredits();

  useEffect(() => {
    if (open) fetchHistory();
  }, [open, fetchHistory]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm bg-card border-border">
        <DialogHeader>
          <DialogTitle className="font-display text-primary">Historial de créditos</DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-80 custom-scrollbar">
          {loading ? (
            <div className="space-y-2 p-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex justify-between">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-12" />
                </div>
              ))}
            </div>
          ) : transactions.length === 0 ? (
            <p className="text-center py-8 text-sm text-muted-foreground">Sin transacciones aún</p>
          ) : (
            <div className="space-y-1 p-1">
              {transactions.map((tx) => {
                const meta = TYPE_LABELS[tx.type];
                return (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between py-2 px-2 rounded-lg bg-background"
                  >
                    <div className="min-w-0">
                      <p className="text-xs truncate text-foreground">{tx.description ?? meta.label}</p>
                      <p className="text-xs font-mono text-muted-foreground">
                        {format(new Date(tx.created_at), "d MMM, HH:mm", { locale: es })}
                      </p>
                    </div>
                    <span className={`text-sm font-bold font-mono tabular-nums ml-3 shrink-0 ${meta.colorClass}`}>
                      {meta.sign}{Math.abs(tx.amount)}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
