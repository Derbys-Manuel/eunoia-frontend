import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from "@mui/material";
import { UserForm } from "./UserForm";
import { createUser, updateUser } from "../../../services/userService";

type User = {
  id: string;
  name: string;
  email: string;
  deleted: boolean;
  avatarUrl: string;
  createdAt: string;
  role: {
    id: string;
    description: string;
  };
};

type ModalUserProps = {
  open: boolean;
  onClose: () => void;
  onDone: () => void;
  mode: "create" | "edit";
  user?: User | null;
};

export default function ModalCreate({ open, onClose, onDone, mode, user }: ModalUserProps) {
  const formId = mode === "edit" ? "user-edit-form" : "user-create-form";

  const handleSubmit = async (data: any) => {
    if (mode === "edit") {
      if (!user) return;
      await updateUser(user.id, data);
    } else {
      await createUser(data);
    }
    onClose();
    onDone();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{mode === "edit" ? "Editar Usuario" : "Crear Usuario"}</DialogTitle>

      <DialogContent dividers>
        <UserForm formId={formId} user={user ?? undefined} onSubmit={handleSubmit} />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="outlined" sx={{ textTransform: "none" }}>
          Cerrar
        </Button>
        <Button
          type="submit"
          form={formId}
          variant="contained"
          sx={{ textTransform: "none" }}
        >
          {mode === "edit" ? "Guardar cambios" : "Guardar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
