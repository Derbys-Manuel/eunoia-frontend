import UsersTable from './partiels/UsersTable';

export default function UserPage() {
    return (
        <div className="p-0">
            <h1 className="text-3xl font-bold mb-3">Usuarios</h1>
            <UsersTable />
        </div>
    );
}
