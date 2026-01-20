import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { LoginCredentials } from "@/types/auth";
import { LoginSchema } from "@/schemas/authSchemas";
import { useAuth } from "../hooks/useAuth";
import { useFlashMessage } from "../hooks/useFlashMessage";
import { RoutesPaths } from "../router/config/routesPaths";
import { errorResponse, successResponse } from "@/common/utils/response";
import FormField from "./ui/formField";
import FieldError from "./ui/FieldError";

function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const [submitting, setSubmitting] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const navigate = useNavigate();
  const { showFlash, clearFlash } = useFlashMessage();
  const { login } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = async (data: LoginCredentials) => {
    clearFlash();
    setSubmitting(true);
    try {
      const response = await login(data);
      if (response.success) {
        showFlash(successResponse(response.message));
        navigate(RoutesPaths.home, { replace: true });
      } else {
        showFlash(errorResponse(response.message));
      }
    } catch {
      showFlash(errorResponse("Credenciales inválidas o error de red"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="bg-black/60 border-white/10 text-white">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Inicia sesión en tu cuenta</CardTitle>
          <CardDescription className="text-center text-white/70">
            Ingresa tu correo electrónico para iniciar sesión
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <FormField
                name="email"
                label="Correo Electrónico"
                placeholder="correo@edominio.com"
                register={register}
                error={errors.email?.message}
              />

              <div className="grid gap-1">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPwd ? "text" : "password"}
                    placeholder="••••••••"
                    {...register("password")}
                    className="pr-10 bg-black/40 border-white/10 text-white placeholder:text-white/40"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd((prev) => !prev)}
                    className="absolute inset-y-0 right-2 grid place-content-center px-2 text-white/70 hover:text-white"
                    aria-label={showPwd ? "Ocultar contraseña" : "Ver contraseña"}
                  >
                    {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <div className="min-h-3 h-auto">
                  <FieldError error={errors.password?.message} />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-[#1565C0] hover:bg-[#1E88E5] text-white transition-colors"
                disabled={submitting}
              >
                {submitting ? "Cargando..." : "Iniciar Sesión"}
              </Button>
            </div>

            <div className="mt-4 text-center text-sm text-white/80">
              ¿No tienes una cuenta?{" "}
              <Link to={RoutesPaths.register} className="underline underline-offset-4">
                Regístrate
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default LoginForm;
