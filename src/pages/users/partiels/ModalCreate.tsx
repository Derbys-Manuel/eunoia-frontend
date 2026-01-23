import { Modal } from "@/components/modal";
import { UserForm } from "./UserForm";
import { createUser, updateUser } from "../../../services/userService";
import { Button } from "@/components/ui/button";

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
    <Modal
      isOpen={open}
      onClose={onClose}
      title={mode === "edit" ? "Editar Usuario" : "Crear Usuario"}
      footer={
        <>
          <Button type="button" className="bg-white text-black border cursor-pointer hover:bg-gray-100 hover:scale-[1.02] transition-all" onClick={onClose}>
            Cerrar
          </Button>
          <Button type="submit" form={formId} className="bg-black text-white hover:bg-gray-800 cursor-pointer hover:scale-[1.02] transition-all">
            {mode === "edit" ? "Guardar cambios" : "Guardar"}
          </Button>
        </>
      }
    >
      <UserForm formId={formId} user={user ?? undefined} onSubmit={handleSubmit} />
    </Modal>
  );
}
