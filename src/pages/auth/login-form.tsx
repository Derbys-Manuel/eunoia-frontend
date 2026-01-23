import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";

import type { LoginCredentials } from "@/types/auth";
import { LoginSchema } from "@/schemas/authSchemas";
import { useAuth } from "../../hooks/useAuth";
import { useFlashMessage } from "../../hooks/useFlashMessage";
import { RoutesPaths } from "../../router/config/routesPaths";
import { errorResponse, successResponse } from "@/common/utils/response";

import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";

function LoginForm({ ...props }: React.ComponentProps<"div">) {
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
      }
    } catch {
      showFlash(errorResponse("Credenciales inválidas o error de red"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      {...props}
      sx={{
        height: "100vh",
        px: 2,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <Card sx={{ width: "100%", maxWidth: 420, boxShadow: 10 }}>
        <CardHeader
          title={
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              Inicio de sesión 
            </Typography>
          }
        />
        <CardContent>
          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: "grid", gap: 2.5 }}>
            <TextField
              label="Correo Electrónico"
              placeholder="correo@edominio.com"
              type="email"
              size="small"
              fullWidth
              {...register("email")}
              error={!!errors.email}
              helperText={errors.email?.message}
            />

            <TextField
              label="Contraseña"
              placeholder="••••••••"
              size="small"
              fullWidth
              type={showPwd ? "text" : "password"}
              {...register("password")}
              error={!!errors.password}
              helperText={errors.password?.message}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPwd((prev) => !prev)}
                      edge="end"
                      aria-label={showPwd ? "Ocultar contraseña" : "Ver contraseña"}
                    >
                      {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              variant="contained"
              disabled={submitting}
              sx={{
                width: "100%",
                textTransform: "none",
                fontWeight: 700,
              }}
            >
              {submitting ? "Cargando..." : "Iniciar Sesión"}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default LoginForm;
