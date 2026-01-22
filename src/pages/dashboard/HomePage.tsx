import { Outlet } from "react-router-dom";
import { HomeIcon, UsersIcon, SettingsIcon, LogOutIcon } from "lucide-react";
import { useLocation } from "react-router-dom";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarInset,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarProvider,
	SidebarSeparator,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";
import { useFlashMessage } from "@/hooks/useFlashMessage";
import { useAuth } from "@/hooks/useAuth";
import { errorResponse, successResponse } from "@/common/utils/response";
import { RoutesPaths } from "@/router/config/routesPaths";


export default function HomePage() {
	const location = useLocation();
	const navigate = useNavigate();
	const {showFlash, clearFlash} = useFlashMessage();
	const {logout} = useAuth();
	const userName = useAuth().userName;
	const userRole = useAuth().userRole?.charAt(0).toUpperCase();
	const restUserRole = useAuth().userRole?.slice(1).toLowerCase();

	const handleLogout = async () => {
		clearFlash();
		try {
			await logout();
			showFlash(successResponse("Sesión cerrada"));
			navigate(RoutesPaths.login, {replace: true});
		}catch {
			showFlash(errorResponse("No se pudo cerrar la sesión"));
		}
	}
	return (
		<SidebarProvider className="w-full" style={{ 
			"--sidebar-width": "8rem"
			 } as React.CSSProperties}>
			<Sidebar variant="inset" collapsible="icon">
				<SidebarHeader>
					<div className="text-lg font-semibold">
						Eunoia <br />
						<p className="text-xs text-center">
							{userName} - {userRole + (restUserRole ?? "")}
						</p>
						</div>
				</SidebarHeader>
				<SidebarSeparator />
				<SidebarContent>
					<SidebarMenu className="flex gap-1">
						<SidebarMenuItem>
							<SidebarMenuButton 
							isActive={location.pathname === RoutesPaths.home}
							className="cursor-pointer hover:scale-[1.02]" 
							tooltip="Dashboard"
							onClick={()=> navigate(RoutesPaths.home)} >
								<HomeIcon className="size-4" />
								Dashboard
							</SidebarMenuButton>
						</SidebarMenuItem>
						<SidebarMenuItem>
							<SidebarMenuButton 
							isActive={location.pathname.startsWith(RoutesPaths.users)}
							className="cursor-pointer hover:scale-[1.02]"  
							tooltip="Users" 
							onClick={()=> navigate(RoutesPaths.users)}> 
								<UsersIcon className="size-4" />
								Users
							</SidebarMenuButton>
						</SidebarMenuItem>
						<SidebarMenuItem>
							<SidebarMenuButton className="cursor-pointer hover:scale-[1.02]" tooltip="Settings">
								<SettingsIcon className="size-4" />
								Settings
							</SidebarMenuButton>
						</SidebarMenuItem>
						<SidebarMenuItem>
							<SidebarMenuButton className="cursor-pointer hover:scale-[1.02]" tooltip="Logout" onClick={handleLogout}>
								<LogOutIcon className="size-4" />
								Logout
							</SidebarMenuButton>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarContent>
				<SidebarSeparator />
				<SidebarFooter>
					<div className="text-xs text-muted-foreground">admin@eunoia</div>
				</SidebarFooter>
			</Sidebar>
			<SidebarInset>
				<div className="flex h-12 items-center gap-2 border-b px-4">
					<SidebarTrigger />
					<div className="text-sm font-semibold">Dashboard</div>
				</div>
				<div className="p-6">
                    <Outlet />
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}