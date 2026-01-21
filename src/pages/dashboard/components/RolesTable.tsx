import { useEffect, useMemo, useState } from "react";
import { findAllRoles } from "@/services/roleService";

type RoleRow = {
  id: string;
  description?: string | null;
};

const PAGE_SIZE = 8;

export default function RolesTable() {
  const [roles, setRoles] = useState<RoleRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await findAllRoles();
      const data = Array.isArray(res) ? res : res?.data ?? [];
      setRoles(data);
    } catch {
      setError("Failed to load roles.");
      setRoles([]);
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
    if (!value) return roles;
    return roles.filter((role) => {
      const haystack = [role.id, role.description].filter(Boolean).join(" ").toLowerCase();
      return haystack.includes(value);
    });
  }, [query, roles]);

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
            placeholder="Search roles..."
            className="h-9 w-56 rounded-lg border border-slate-700 bg-slate-200  px-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-emerald-400 focus:outline-none"
          />
          <button
            onClick={load}
            className="h-9 rounded-lg border border-slate-700 bg-slate-900 px-3 text-sm text-slate-200 hover:border-white"
          >
            Refresh
          </button>
        </div>
        <p className="text-xs text-slate-100">
          {filtered.length} role{filtered.length === 1 ? "" : "s"}
        </p>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-slate-800">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-900 text-xs uppercase tracking-wide text-slate-100">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {loading && (
              <tr>
                <td className="px-4 py-5 text-slate-100" colSpan={2}>
                  Loading roles...
                </td>
              </tr>
            )}
            {!loading && error && (
              <tr>
                <td className="px-4 py-5 text-rose-300" colSpan={2}>
                  {error}
                </td>
              </tr>
            )}
            {!loading && !error && pageRows.length === 0 && (
              <tr>
                <td className="px-4 py-5 text-slate-100" colSpan={2}>
                  No roles found.
                </td>
              </tr>
            )}
            {!loading &&
              !error &&
              pageRows.map((role) => (
                <tr key={role.id} className="hover:bg-slate-900/60">
                  <td className="px-4 py-3 text-slate-300">{role.id}</td>
                  <td className="px-4 py-3 text-slate-200">
                    {role.description ?? "-"}
                  </td>
                </tr>
              ))}
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
            className="rounded-md border border-slate-800 px-2 py-1 disabled:opacity-40"
          >
            Prev
          </button>
          <button
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={safePage === totalPages}
            className="rounded-md border border-slate-800 px-2 py-1 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
