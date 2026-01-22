import UsersTable from './UsersTable';

export default function UserPage() {
    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Usuarios</h1>
            <UsersTable />
        </div>
    );
}
