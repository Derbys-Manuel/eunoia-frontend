import UsersTable from "../components/UsersTable";
import { Box, Typography } from "@mui/material";

export default function UserPage() {
  return (
    <Box sx={{ p: 0 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 2 }}>
        Usuarios
      </Typography>
      <UsersTable />
    </Box>
  );
}
