import DashboardHeader from "./components/DashboardHeader";
import DashboardSection from "./components/DashboardSection";
import RolesTable from "./components/RolesTable";
import UsersTable from "./components/UsersTable";

export default function HomePage() {
  return (
	<div>
		<DashboardHeader />
		<div className="mt-8 grid grid-cols-12 gap-8">
			<div className="col-span-6">
			<DashboardSection
				title="Users"
				description="Search, review, and refresh the latest users."
			>
				<UsersTable />
			</DashboardSection>
			</div>
			<div className="col-span-6">
			<DashboardSection
				title="Roles"
				description="Manage the list of roles available in the system."
			>
				<RolesTable />
			</DashboardSection>
			</div>
		</div>
		</div>
	);
}