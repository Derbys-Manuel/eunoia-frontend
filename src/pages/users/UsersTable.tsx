import { useEffect, useMemo, useState } from "react";
import { findAll } from "@/services/userService";
import * as Dialog from "@radix-ui/react-dialog";


type UserRow = {
  user_id: string;
  user_name: string ;
  user_email: string;
  user_deleted: boolean;
  user_created_at: string;
  rol: string;
};

const PAGE_SIZE = 8;

export default function UsersTable() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await findAll({});
      const data = Array.isArray(res) ? res : res?.data ?? [];
      setUsers(data);
    } catch {
      setError("Failed to load users.");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [query]);

  const filtered = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return users;
    return users.filter((user) => {
      const roleLabel = user.rol;
      const nameLabel = user.user_name;
      const emailLabel = user.user_email;
      const stateLabel = user.user_deleted;
      const createdAtLabel = user.user_created_at;
      const haystack = [nameLabel, emailLabel, roleLabel, stateLabel, createdAtLabel].join(" ").toLowerCase();
      return haystack.includes(value);
    });
  }, [query, users]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const pageRows = filtered.slice(start, start + PAGE_SIZE);

  useEffect(() => {
    if (page !== safePage) setPage(safePage);
  }, [page, safePage]);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search users..."
            className="h-9 w-56 rounded-lg border border-slate-700 bg-slate-200 px-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none"
          />
          <button
            onClick={load}
            className="h-9 rounded-lg border border-slate-700 bg-slate-900 px-3 text-sm text-slate-200 hover:border-white"
          >
            Refresh
          </button>
          <button
            onClick={load}
            className="h-9 rounded-lg border border-slate-700 bg-slate-900 px-3 text-sm text-slate-200 hover:border-white"
          >
            Create User
          </button>
        </div>
        <p className="text-xs text-slate-100">
          {filtered.length} user{filtered.length === 1 ? "" : "s"}
        </p>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-slate-800">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-900 text-xs uppercase tracking-wide text-slate-100">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Created At</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {loading && (
              <tr>
                <td className="px-4 py-5 text-slate-400" colSpan={4}>
                  Loading users...
                </td>
              </tr>
            )}
            {!loading && error && (
              <tr>
                <td className="px-4 py-5 text-rose-300" colSpan={4}>
                  {error}
                </td>
              </tr>
            )}
            {!loading && !error && pageRows.length === 0 && (
              <tr>
                <td className="px-4 py-5 text-slate-400" colSpan={4}>
                  No users found.
                </td>
              </tr>
            )}
            {!loading &&
              !error &&
              pageRows.map((user) => {
                const nameLabel = user.user_name || "-";
                const emailLabel = user.user_email || "-";
                const roleLabel = user.rol || "-";
                const createdAtLabel = user.user_created_at || "-";
                const statusLabel =
                  user.user_deleted === true
                    ? "Deleted"
                    : user.user_deleted === false
                      ? "Active"
                      : user.user_deleted || "-";
                return (
                  <tr key={user.user_id} className="hover:bg-slate-900/60">
                    <td className="px-4 py-3 text-black">{nameLabel}</td>
                    <td className="px-4 py-3 text-black">{emailLabel}</td>
                    <td className="px-4 py-3 text-black">{roleLabel}</td>
                    <td className="px-4 py-3 text-black">{statusLabel}</td>
                    <td className="px-4 py-3 text-black">{createdAtLabel}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-slate-100">
        <span>
          Page {safePage} of {totalPages}
        </span>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={safePage === 1}
            className=" rounded-md cursor-pointer border border-slate-800 px-2 py-1 disabled:opacity-40"
          >
            <span className="text-black">Prev</span>
          </button>
          <button
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={safePage === totalPages}
            className=" rounded-md cursor-pointer border border-slate-800 px-2 py-1 disabled:opacity-40"
          >
            <span className="text-black">Next</span>
          </button>
        </div>
      </div>
    </div>
  );
}
