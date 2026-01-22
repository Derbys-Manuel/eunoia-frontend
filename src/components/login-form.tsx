import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "@/components/image";
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
import img from "../assets/images/imag.png";

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
      console.log(response);
      if (response.success) {
        showFlash(successResponse(response.message));
        navigate(RoutesPaths.home, { replace: true });
      }
    } catch {
      showFlash(errorResponse("Credenciales inválidas o error de red"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className={cn(
        "h-screen flex flex-col md:flex-row items-center justify-center gap-6 overflow-hidden px-4",
        className
      )}
      {...props}
    >
      <Image
        src={img}
        alt="Eunoia"
        fallback="/placeholder.png"
        className="mx-auto w-full max-w-md max-h-[40vh] md:max-h-[70vh] object-contain"
      />
      <Card className="w-full max-w-md shadow-2xl border-none">
        <CardHeader>
          <CardTitle className="font-mono text-xl mb-3 font-extrabold tracking-wide ">
            Inicia sesión en tu cuenta
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <FormField 
                className="font-mono"
                name="email"
                label="Correo Electrónico"
                placeholder="correo@edominio.com"
                register={register}
                error={errors.email?.message}
              />
              <div className="grid gap-1">
                <Label htmlFor="password" className="font-mono ">
                  Contraseña
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPwd ? "text" : "password"}
                    placeholder="••••••••"
                    {...register("password")}
                    className="pr-10 bg-black/40 border-white/10 text-white placeholder:text-white/80"
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
                className="w-full bg-sky-500 hover:bg-sky-700 text-white hover:scale-[1.02] cursor-pointer"
                disabled={submitting}
              >
                {submitting ? "Cargando..." : "Iniciar Sesión"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default LoginForm;
