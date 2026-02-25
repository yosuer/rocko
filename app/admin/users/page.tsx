'use client';

import { useState, useEffect, useCallback } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { UserTable } from '@/components/admin/UserTable';
import type { User } from '@/lib/types';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const res = await fetch('/api/admin/users');
    if (res.ok) setUsers(await res.json());
    setLoading(false);
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1
          className="text-3xl font-bold"
          style={{ fontFamily: 'var(--font-playfair)', color: 'oklch(0.82 0.13 88)' }}
        >
          Usuarios
        </h1>
        <p className="text-sm mt-1" style={{ color: 'oklch(0.55 0.025 60)' }}>
          {users.length} usuarios registrados
        </p>
      </div>

      <div
        className="rounded-xl overflow-hidden"
        style={{
          background: 'oklch(0.16 0.028 42)',
          border: '1px solid oklch(0.28 0.025 42)',
        }}
      >
        {loading ? (
          <div className="p-4 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex gap-4">
                {Array.from({ length: 6 }).map((__, j) => (
                  <Skeleton key={j} className="h-8 flex-1" />
                ))}
              </div>
            ))}
          </div>
        ) : (
          <UserTable users={users} onRefresh={fetchUsers} />
        )}
      </div>
    </div>
  );
}
