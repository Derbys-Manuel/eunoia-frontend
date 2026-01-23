import { useEffect } from "react";
import LoginForm from "./login-form";
import { Box } from "@mui/material";

export default function LoginPage() {
  useEffect(() => {
    const prevHtmlOverflow = document.documentElement.style.overflow;
    const prevBodyOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = prevHtmlOverflow;
      document.body.style.overflow = prevBodyOverflow;
    };
  }, []);

  return (
    <Box sx={{ height: "100vh", overflow: "hidden" }}>
      <LoginForm />
    </Box>
  );
}
