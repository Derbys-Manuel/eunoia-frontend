import React, { useEffect, useState } from 'react';
import { useForm, useWatch } from "react-hook-form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { UpdateUserDto } from '@/types/user';
import {findAllRoles}  from '../../../services/roleService'
import FormField from "../../../components/ui/formField";




interface User {
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
}

interface UserFormProps {
    user?: User;
    onSubmit: (data: UserFormData) => void;
    formId?: string;
}

type UserFormData = UpdateUserDto & { avatarUrl?: string };

export const UserForm: React.FC<UserFormProps> = ({ user, onSubmit, formId }) => {
    const [roles, setRoles] = useState([]);
    const {
        register,
        handleSubmit,
        setError,
        setValue,
        control,
        formState: { errors },
    } = useForm<UserFormData>({
        defaultValues: {
            name: user?.name || '',
            email: user?.email || '',
            roleId: user?.role?.id || '',
            avatarUrl: user?.avatarUrl || '',
        },
    });

    const getRoles = async () => {
        try {
            const response = await findAllRoles();
            setRoles(response);
        } catch (error) {
            console.error('Error fetching roles:', error);
        }
    };
    useEffect(() => {
        getRoles();
    }, []);

    const roleId = useWatch({ control, name: "roleId" });

    const onSubmitForm = async (data: UserFormData) => {
        try {
            await onSubmit(data);
        } catch (error: any) {
            const message: string | undefined = error?.response?.data?.message || error?.message;
            if (!message) return;

            const parts = message.split(" | ");
            for (const part of parts) {
                const lower = part.toLowerCase();
                if (lower.includes("name")) {
                    setError("name", { type: "server", message: part });
                } else if (lower.includes("email")) {
                    setError("email", { type: "server", message: part });
                } else if (lower.includes("password")) {
                    setError("password" as any, { type: "server", message: part });
                } else if (lower.includes("role")) {
                    setError("roleId", { type: "server", message: part });
                }
            }
        }
    };

    return (
        <form id={formId} onSubmit={handleSubmit(onSubmitForm)} className="user-form">
            <FormField
                className="font-mono"
                name="name"
                label="Nombre"
                placeholder="Nombre completo"
                register={register}
                error={errors.name?.message}
            />

            <FormField
                className="font-mono"
                name="email"
                label="Correo Electrónico"
                placeholder="correo@edominio.com"
                type="email"
                register={register}
                error={errors.email?.message}
            />
            <FormField
                className="font-mono"
                name="password"
                label="Contraseña"
                placeholder="Contraseña"
                type="password"
                register={register}
                error={errors.password?.message}
            />

            <div className="grid gap-1">
                <label className="text-sm text-left">Rol</label>
                <input type="hidden" {...register("roleId")} />
                <Select
                    value={roleId}
                    onValueChange={(value) => setValue("roleId", value, { shouldDirty: true })}
                >
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecciona un rol" />
                    </SelectTrigger>
                    <SelectContent className='bg-zinc-200 text-black'>
                        {roles.map((role: any) => (
                            <SelectItem key={role.id} value={role.id}>
                                {role.description}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {errors.roleId && (
                    <p className="text-xs text-red-500">
                    {errors.roleId.message}
                    </p>
                )}
            </div>
        </form>
    );
};
