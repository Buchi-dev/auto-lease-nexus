import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { User } from '@/types';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

async function api<T>(path: string, opts: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(opts.headers || {}) },
    ...opts,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.error?.message || res.statusText);
  }
  return res.json();
}

export default function Users() {
  const { token } = useAuthStore();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await api<{ data: User[] }>(`/api/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(data.data);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [token]);

  if (loading) return <div className="p-4">Loading users...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-semibold mb-4">Users</h1>
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left border-b">
            <th className="p-2">Name</th>
            <th className="p-2">Email</th>
            <th className="p-2">Role</th>
            <th className="p-2">Active</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id || u._id} className="border-b">
              <td className="p-2">{u.name}</td>
              <td className="p-2">{u.email}</td>
              <td className="p-2">{u.role}</td>
              <td className="p-2">{u.isActive ? 'Yes' : 'No'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
