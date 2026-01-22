import React, { use, useEffect, useState } from 'react';
import * as Form from '@radix-ui/react-form';
import * as Select from '@radix-ui/react-select';
import type { UpdateUserDto } from '@/types/user';
import './UserForm.css';
import {findAllRoles}  from '../../services/roleService'


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
}

type UserFormData = UpdateUserDto & { avatarUrl?: string };

export const UserForm: React.FC<UserFormProps> = ({ user, onSubmit }) => {
    const [roles, setRoles] = useState([]);

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

    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        roleId: user?.role?.id || 'user',
        avatarUrl: user?.avatarUrl || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <Form.Root onSubmit={handleSubmit} className="user-form">
            <Form.Field name="name" className="form-field">
                <Form.Label>Nombre</Form.Label>
                <Form.Control asChild>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </Form.Control>
            </Form.Field>

            <Form.Field name="email" className="form-field">
                <Form.Label>Email</Form.Label>
                <Form.Control asChild>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </Form.Control>
            </Form.Field>

            <Form.Field name="roleId" className="form-field">
                <Form.Label>Rol</Form.Label>
                <Select.Root
                    value={formData.roleId}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, roleId: value }))}
                >
                    <Select.Trigger>
                        <Select.Value />
                    </Select.Trigger>
                    <Select.Content>
                        {roles.map((role: any) => (
                            <Select.Item key={role.id} value={role.id}>
                                {role.description}
                            </Select.Item>
                        ))}
                    </Select.Content>
                </Select.Root>
            </Form.Field>

            <Form.Field name="avatarUrl" className="form-field">
                <Form.Label>Avatar URL</Form.Label>
                <Form.Control asChild>
                    <input
                        type="url"
                        name="avatarUrl"
                        value={formData.avatarUrl}
                        onChange={handleChange}
                    />
                </Form.Control>
            </Form.Field>

            <Form.Submit asChild>
                <button type="submit">{user ? 'Actualizar' : 'Crear'} Usuario</button>
            </Form.Submit>
        </Form.Root>
    );
};
