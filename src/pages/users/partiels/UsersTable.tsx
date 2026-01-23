import { useEffect, useMemo, useState } from "react";
import { findAll, findActives, deleteUser, findDesactive, restoreUser } from "@/services/userService";
import ModalCreate from "./ModalCreate";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { errorResponse, successResponse } from "@/common/utils/response";
import { useFlashMessage } from "@/hooks/useFlashMessage";
import { RotateCcw, Beer, Pencil } from "lucide-react";

type UserRow = {
  user_id: string;
  user_name: string ;
  user_email: string;
  user_deleted: boolean;
  user_created_at: string;
  rol: string;
  roleId: string;
};

const PAGE_SIZE = 8;

export default function UsersTable() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [openCreate, setOpenCreate] = useState(false);
  const [mode, setMode] = useState<"create" | "edit">("create");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showUsersActive, setShowUsersActive] = useState(true);
  const { showFlash, clearFlash } = useFlashMessage();

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await findAll({});
      const data: UserRow[] = Array.isArray(res) ? res : res?.data ?? [];
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

  const handleCheckboxChange = async (checked: boolean) => {
    setShowUsersActive(checked);
    try {
      setLoading(true);
      setError(null);
      if (checked) {
        const res = await findActives({});
        const data: UserRow[] = Array.isArray(res) ? res : res?.data ?? [];
        setUsers(data);
      } else { 
        const res = await findDesactive({});
        const data: UserRow[] = Array.isArray(res) ? res : res?.data ?? [];
        setUsers(data);
      }
    } catch {
      setError("Failed to load users.");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
  clearFlash();
  setLoading(true);
  try {
    const response = await deleteUser(userId);
      const ok = response?.success ?? true;
      if (ok) {
        showFlash(successResponse(response?.message ?? "Usuario eliminado"));
        await handleCheckboxChange(showUsersActive);
      } else {
        showFlash(errorResponse(response?.message ?? "No se pudo eliminar el usuario"));
      }
  } catch {
    showFlash(errorResponse("Credenciales inválidas o error de red"));
  } finally {
    setLoading(false);
  }
};

const handleRestoreUser = async (userId: string) =>{
  clearFlash();
  setLoading(true);
  try {
    const res = await restoreUser(userId);
      const ok = res?.success ?? true;
      if(ok){
        showFlash(successResponse(res?.message ?? "Usuario restaurado"));
        await handleCheckboxChange(showUsersActive);
      } else {
        showFlash(errorResponse(res?.message ?? "No se pudo restaurar el usuario"));
      }
} catch{
	showFlash(errorResponse('Error al restaurar usuario'));
}finally {
	setLoading(false);
}
}

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
      <ModalCreate
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onDone={load}
        mode={mode}
        user={selectedUser}
      />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <input 
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search users..."
            className="h-9 w-56 rounded-lg border border-slate-700 bg-slate-200 px-3 text-sm text-slate-700 placeholder:text-slate-500  focus:outline-none"
          />
          <button
            onClick={load}
            className="h-9 rounded-lg border border-slate-700 bg-slate-900 px-3 text-sm text-slate-200 hover:border-white"
          >
            Refresh
          </button>
          <button
            onClick={() => {
              setMode("create");
              setSelectedUser(null);
              setOpenCreate(true);
            }}
            className="h-9 rounded-lg border border-slate-700 bg-slate-900 px-3 text-sm text-slate-200 hover:border-white"
          >
            Create User
          </button>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <Checkbox
              checked={showUsersActive}
              onCheckedChange={(value) => handleCheckboxChange(value === true)}
            />
            {showUsersActive === true ? 'Actives': 'Desactives'}
          </label>
        </div>
        <p className="text-xs text-slate-700">
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
              <th className="px-4 py-3">Options</th>
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
                <td className="px-4 py-5 text-slate-700" colSpan={4}>
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
				const stateLabel = user.user_deleted === false ? 'Active' : 'Desactive';
                const createdAtLabel = user.user_created_at
                ? new Intl.DateTimeFormat("es-ES", {
                    dateStyle: "short",
                    timeStyle: "short",
                  }).format(new Date(user.user_created_at))
                : "-";
      
                return (
                  <tr key={user.user_id} className="hover:bg-slate-500/60">
                    <td className="px-4 py-3 text-black">{nameLabel}</td>
                    <td className="px-4 py-3 text-black">{emailLabel}</td>
                    <td className="px-4 py-3 text-black">{roleLabel}</td>
                    <td className="px-4 py-3 text-black">{stateLabel}</td>
                    <td className="flex">
                     {showUsersActive ? (
                        <Button
                          onClick={() => handleDeleteUser(user.user_id)}
                          className={cn(
                            "h-6 transition-all mt-2 mx-2 hover:scale-[1.02] cursor-pointer",
                            "bg-red-500 hover:bg-red-600 text-black hover:text-white"
                          )}
                        >
                          <Beer />
                        </Button>
                      ) : (
						<Button
						onClick={() => handleRestoreUser(user.user_id)}
						className={cn(
							"h-6 transition-all mt-2 mx-2 hover:scale-[1.02] cursor-pointer",
							"bg-gray-200 hover:bg-gray-300 text-gray-600"
						)}
						>
						<RotateCcw className="h-4 w-4" />
						</Button>
                      )}
                      <Button className={cn("cursor-pointer mt-2 bg-yellow-500 h-6 hover:bg-yellow-600 text-black hover:text-white hover:scale-[1.02] transition-all")} onClick={() => {
                        setMode("edit");
                          setSelectedUser({
                            id: user.user_id,
                            name: user.user_name,
                            email: user.user_email,
                            deleted: user.user_deleted,
                            avatarUrl: "",
                            createdAt: user.user_created_at,
                            role: { id: user.roleId , description: user.rol },
                          });
                        setOpenCreate(true);
                      }}>
                        <Pencil />
                      </Button>
                    </td>
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
