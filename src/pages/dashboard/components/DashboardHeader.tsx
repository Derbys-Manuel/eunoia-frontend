import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useFlashMessage } from "@/hooks/useFlashMessage";
import { RoutesPaths } from "@/router/config/routesPaths";
import { errorResponse, successResponse } from "@/common/utils/response";
import { useAuth } from "@/hooks/useAuth";

export default function DashboardHeader() {
  const navigate = useNavigate();
  const { showFlash, clearFlash } = useFlashMessage();
  const { logout } = useAuth();

  const handleLogout = async () => {
    clearFlash();
    try {
      await logout();
      showFlash(successResponse("Sesión cerrada"));
      navigate(RoutesPaths.login, { replace: true });
    } catch {
      showFlash(errorResponse("No se pudo cerrar la sesión"));
    }
  };

  return (
    <div className="mt-6 grid grid-cols-12 gap-3">
      <div className="col-span-12 flex items-end justify-start">
        <Button size="icon" variant="outline" className="cursor-pointer" onClick={handleLogout}>
          Exit
        </Button>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-slate-100 p-6 shadow-lg col-span-12">
        <p className="text-xs uppercase tracking-[0.2em] text-blue-950">Admin</p>
        <h1 className="mt-2 text-3xl font-semibold text-blue-950">Dashboard</h1>
      </div>
    </div>
  );
}
