import { useEffect, useMemo, useState } from "react";
import {
  findAll,
  findActives,
  deleteUser,
  findDesactive,
  restoreUser,
} from "@/services/userService";
import { errorResponse, successResponse } from "@/common/utils/response";
import { useFlashMessage } from "@/hooks/useFlashMessage";
import { RoutesPaths } from "@/router/config/routesPaths";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

import { RotateCcw, Beer, Pencil } from "lucide-react";

type UserRow = {
  user_id: string;
  user_name: string;
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
  const [showUsersActive, setShowUsersActive] = useState(true);

  const { showFlash, clearFlash } = useFlashMessage();
  const navigate = useNavigate();

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

  const handleRestoreUser = async (userId: string) => {
    clearFlash();
    setLoading(true);
    try {
      const res = await restoreUser(userId);
      const ok = res?.success ?? true;
      if (ok) {
        showFlash(successResponse(res?.message ?? "Usuario restaurado"));
        await handleCheckboxChange(showUsersActive);
      } else {
        showFlash(errorResponse(res?.message ?? "No se pudo restaurar el usuario"));
      }
    } catch {
      showFlash(errorResponse("Error al restaurar usuario"));
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return users;

    return users.filter((user) => {
      const roleLabel = user.rol;
      const nameLabel = user.user_name;
      const emailLabel = user.user_email;
      const stateLabel = String(user.user_deleted);
      const createdAtLabel = user.user_created_at;
      const haystack = [nameLabel, emailLabel, roleLabel, stateLabel, createdAtLabel]
        .join(" ")
        .toLowerCase();
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
    <Box>
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        alignItems={{ xs: "stretch", md: "center" }}
        justifyContent="space-between"
      >
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} alignItems="center">
          <TextField
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search users..."
            size="small"
            sx={{ width: 260 }}
          />
          <Button
            className="w-2"
            onClick={load}
            disabled={loading}
            sx={{ textTransform: "none" }}
          >
            <RotateCcw size={18}/>
          </Button>
          <FormControlLabel
            label={showUsersActive ? "Actives" : "Desactives"}
            control={
              <Checkbox
                checked={showUsersActive}
                onChange={(e) => handleCheckboxChange(e.target.checked)}
              />
            }
          />
        </Stack>

        <Typography variant="caption" color="text.secondary">
          {filtered.length} user{filtered.length === 1 ? "" : "s"}
        </Typography>
      </Stack>

      <TableContainer component={Paper} sx={{ mt: 2, borderRadius: 2, overflow: "hidden" }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: "grey.900" }}>
              {["Name", "Email", "Role", "Status", "Options", "Created At"].map((h) => (
                <TableCell key={h} sx={{ color: "grey.100", fontWeight: 700 }}>
                  {h}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={6} sx={{ py: 2, color: "text.secondary" }}>
                  Loading users...
                </TableCell>
              </TableRow>
            )}

            {!loading && error && (
              <TableRow>
                <TableCell colSpan={6} sx={{ py: 2, color: "error.main" }}>
                  {error}
                </TableCell>
              </TableRow>
            )}

            {!loading && !error && pageRows.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} sx={{ py: 2, color: "text.secondary" }}>
                  No users found.
                </TableCell>
              </TableRow>
            )}

            {!loading &&
              !error &&
              pageRows.map((user) => {
                const nameLabel = user.user_name || "-";
                const emailLabel = user.user_email || "-";
                const roleLabel = user.rol || "-";
                const stateLabel = user.user_deleted === false ? "Active" : "Desactive";
                const createdAtLabel = user.user_created_at
                  ? new Intl.DateTimeFormat("es-ES", {
                      dateStyle: "short",
                      timeStyle: "short",
                    }).format(new Date(user.user_created_at))
                  : "-";

                return (
                  <TableRow key={user.user_id} hover>
                    <TableCell>{nameLabel}</TableCell>
                    <TableCell>{emailLabel}</TableCell>
                    <TableCell>{roleLabel}</TableCell>
                    <TableCell>{stateLabel}</TableCell>

                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        {showUsersActive ? (
                          <IconButton
                            onClick={() => handleDeleteUser(user.user_id)}
                            disabled={loading}
                            size="small"
                            sx={{
                              bgcolor: "error.main",
                              "&:hover": { bgcolor: "error.dark" },
                              color: "common.white",
                            }}
                          >
                            <Beer size={18} />
                          </IconButton>
                        ) : (
                          <IconButton
                            onClick={() => handleRestoreUser(user.user_id)}
                            disabled={loading}
                            size="small"
                            sx={{
                              bgcolor: "grey.200",
                              "&:hover": { bgcolor: "grey.300" },
                              color: "text.primary",
                            }}
                          >
                            <RotateCcw size={18} />
                          </IconButton>
                        )}

                        <IconButton
                          onClick={() => {
                            navigate(RoutesPaths.createUser, {
                              state: {
                                mode: "edit",
                                user: {
                                  id: user.user_id,
                                  name: user.user_name,
                                  email: user.user_email,
                                  deleted: user.user_deleted,
                                  avatarUrl: "",
                                  createdAt: user.user_created_at,
                                  role: { id: user.roleId, description: user.rol },
                                },
                              },
                            });
                          }}
                          size="small"
                          sx={{
                            bgcolor: "warning.main",
                            "&:hover": { bgcolor: "warning.dark" },
                            color: "common.black",
                          }}
                        >
                          <Pencil size={18} />
                        </IconButton>
                      </Stack>
                    </TableCell>

                    <TableCell>{createdAtLabel}</TableCell>
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>

      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 2 }}>
        <Typography variant="caption" color="text.secondary">
          Page {safePage} of {totalPages}
        </Typography>

        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            onClick={() => setPage((prev) => Math.max(1, prev - 1))}
            disabled={safePage === 1 || loading}
            sx={{ textTransform: "none" }}
          >
            Prev
          </Button>
          <Button
            variant="outlined"
            onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={safePage === totalPages || loading}
            sx={{ textTransform: "none" }}
          >
            Next
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
