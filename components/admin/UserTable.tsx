'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import type { User } from '@/lib/types';

interface UserTableProps {
  users: User[];
  onRefresh: () => void;
}

export function UserTable({ users, onRefresh }: UserTableProps) {
  const [rechargeTarget, setRechargeTarget] = useState<User | null>(null);
  const [rechargeAmount, setRechargeAmount] = useState('50');
  const [loading, setLoading] = useState(false);

  async function handleRecharge() {
    if (!rechargeTarget) return;
    const amount = parseInt(rechargeAmount, 10);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Cantidad inválida');
      return;
    }

    setLoading(true);
    const res = await fetch('/api/credits', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        target_user_id: rechargeTarget.id,
        amount,
        description: `Recarga manual por admin: +${amount} créditos`,
      }),
    });

    if (res.ok) {
      toast.success(`+${amount} créditos agregados a ${rechargeTarget.username}`);
      setRechargeTarget(null);
      onRefresh();
    } else {
      const data = await res.json();
      toast.error(data.error ?? 'Error al recargar');
    }
    setLoading(false);
  }

  async function handleBan(user: User) {
    const action = user.is_banned ? 'desbanear' : 'banear';
    if (!confirm(`¿${action} a ${user.username}?`)) return;

    const res = await fetch(`/api/admin/users/${user.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_banned: !user.is_banned }),
    });

    if (res.ok) {
      toast.success(`Usuario ${action}do`);
      onRefresh();
    } else {
      toast.error('Error al actualizar usuario');
    }
  }

  return (
    <>
      <table className="w-full text-sm">
        <thead>
          <tr style={{ borderBottom: '1px solid oklch(0.25 0.025 42)' }}>
            {['Usuario', 'Email', 'Rol', 'Créditos', 'Estado', 'Acciones'].map((h) => (
              <th
                key={h}
                className="px-4 py-3 text-left text-xs uppercase tracking-wider font-mono"
                style={{ color: 'oklch(0.55 0.025 60)' }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} style={{ borderBottom: '1px solid oklch(0.20 0.022 40)' }}>
              <td className="px-4 py-3 font-medium" style={{ color: 'oklch(0.90 0.025 80)' }}>
                {user.username}
              </td>
              <td className="px-4 py-3 text-xs" style={{ color: 'oklch(0.60 0.025 60)' }}>
                {user.email}
              </td>
              <td className="px-4 py-3">
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-mono"
                  style={{
                    background: user.role === 'admin' ? 'oklch(0.71 0.145 85 / 0.15)' : 'oklch(0.22 0.025 42)',
                    color: user.role === 'admin' ? 'oklch(0.82 0.13 88)' : 'oklch(0.60 0.025 60)',
                  }}
                >
                  {user.role}
                </span>
              </td>
              <td
                className="px-4 py-3 font-mono tabular-nums"
                style={{ color: 'oklch(0.71 0.145 85)' }}
              >
                {user.credits}
              </td>
              <td className="px-4 py-3">
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-mono"
                  style={{
                    background: user.is_banned ? 'oklch(0.48 0.175 25 / 0.2)' : 'oklch(0.68 0.16 145 / 0.15)',
                    color: user.is_banned ? 'oklch(0.65 0.175 25)' : 'oklch(0.68 0.16 145)',
                  }}
                >
                  {user.is_banned ? 'Baneado' : 'Activo'}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <button
                    onClick={() => { setRechargeTarget(user); setRechargeAmount('50'); }}
                    className="text-xs px-2 py-1 rounded"
                    style={{ background: 'oklch(0.22 0.025 42)', color: 'oklch(0.71 0.145 85)' }}
                  >
                    + Créditos
                  </button>
                  <button
                    onClick={() => handleBan(user)}
                    className="text-xs px-2 py-1 rounded"
                    style={{
                      background: 'oklch(0.22 0.025 42)',
                      color: user.is_banned ? 'oklch(0.68 0.16 145)' : 'oklch(0.58 0.175 25)',
                    }}
                  >
                    {user.is_banned ? 'Desbanear' : 'Banear'}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal recarga de créditos */}
      <Dialog open={!!rechargeTarget} onOpenChange={() => setRechargeTarget(null)}>
        <DialogContent
          style={{
            background: 'oklch(0.16 0.028 42)',
            border: '1px solid oklch(0.71 0.145 85 / 0.3)',
          }}
        >
          <DialogHeader>
            <DialogTitle style={{ fontFamily: 'var(--font-playfair)', color: 'oklch(0.82 0.13 88)' }}>
              Recargar créditos
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm" style={{ color: 'oklch(0.65 0.025 60)' }}>
              Agregar créditos a{' '}
              <span style={{ color: 'oklch(0.82 0.13 88)' }}>{rechargeTarget?.username}</span>
              {' '}(saldo actual: <span style={{ color: 'oklch(0.71 0.145 85)' }}>{rechargeTarget?.credits}</span>)
            </p>
            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-wider font-mono" style={{ color: 'oklch(0.60 0.025 60)' }}>
                Cantidad de créditos
              </Label>
              <Input
                type="number"
                min={1}
                value={rechargeAmount}
                onChange={(e) => setRechargeAmount(e.target.value)}
                style={{ background: 'oklch(0.12 0.022 40)', borderColor: 'oklch(0.32 0.038 60 / 0.5)' }}
              />
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setRechargeTarget(null)}
                className="flex-1"
                style={{ borderColor: 'oklch(0.32 0.038 60 / 0.5)', color: 'oklch(0.60 0.025 60)' }}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleRecharge}
                disabled={loading}
                className="flex-1 gold-button border-none font-semibold"
                style={{ color: 'oklch(0.12 0.022 42)' }}
              >
                {loading ? 'Recargando...' : `Agregar ${rechargeAmount} créditos`}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
