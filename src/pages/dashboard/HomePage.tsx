import * as React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { styled, useTheme, type Theme, type CSSObject } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar, { type AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import { HomeIcon, UsersIcon, LogOutIcon } from "lucide-react";

import { useFlashMessage } from "@/hooks/useFlashMessage";
import { useAuth } from "@/hooks/useAuth";
import { errorResponse, successResponse } from "@/common/utils/response";
import { RoutesPaths } from "@/router/config/routesPaths";

const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

function formatRole(role?: string) {
  if (!role) return "";
  return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
}

function getPageTitle(pathname: string) {
  if (pathname === RoutesPaths.home || pathname === "/") return "Dashboard";
  if (pathname.startsWith(RoutesPaths.users)) return "Users";
  // fallback: último segmento
  const seg = pathname.split("/").filter(Boolean).at(-1) ?? "";
  return seg ? seg.charAt(0).toUpperCase() + seg.slice(1) : "Dashboard";
}

type NavItem = {
  label: string;
  tooltip: string;
  path?: string;
  icon: React.ReactNode;
  onClick?: () => void;
  isActive?: boolean;
};

export default function HomePage() {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const { showFlash, clearFlash } = useFlashMessage();
  const { logout, userName, userRole } = useAuth();

  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);

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

  const navItems: NavItem[] = [
    {
      label: "Dashboard",
      tooltip: "Dashboard",
      path: RoutesPaths.home,
      icon: <HomeIcon size={18} />,
      isActive: location.pathname === RoutesPaths.home || location.pathname === "/",
      onClick: () => navigate(RoutesPaths.home),
    },
    {
      label: "Users",
      tooltip: "Users",
      path: RoutesPaths.users,
      icon: <UsersIcon size={18} />,
      isActive: location.pathname.startsWith(RoutesPaths.users),
      onClick: () => navigate(RoutesPaths.users),
    },
  ];

  const title = getPageTitle(location.pathname);

  return (
    <Box sx={{ display: "flex", width: "100%" }}>
      <CssBaseline />

      <AppBar position="fixed" open={open}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{ mr: 2, ...(open && { display: "none" }) }}
            >
              <MenuIcon />
            </IconButton>

            <Typography variant="h6" noWrap component="div">
              {title}
            </Typography>
          </Box>

          <Typography variant="body2" noWrap sx={{ opacity: 0.9 }}>
            {userName}{" "}
            {userRole ? (
              <span style={{ opacity: 0.85 }}>- {formatRole(userRole)}</span>
            ) : null}
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer variant="permanent" open={open}>
        <DrawerHeader sx={{ justifyContent: "space-between" }}>
          <Box sx={{ pl: 1.5, display: "flex", flexDirection: "column" }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.1 }}>
              Eunoia
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.8 }}>
              admin@eunoia
            </Typography>
          </Box>

          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader>

        <Divider />

        <List>
          {navItems.map((item) => (
            <ListItem key={item.label} disablePadding sx={{ display: "block" }}>
              <ListItemButton
                onClick={item.onClick}
                selected={!!item.isActive}
                sx={[
                  { minHeight: 48, px: 2.5 },
                  open ? { justifyContent: "initial" } : { justifyContent: "center" },
                ]}
              >
                <ListItemIcon
                  sx={[
                    { minWidth: 0, justifyContent: "center" },
                    open ? { mr: 3 } : { mr: "auto" },
                  ]}
                >
                  {item.icon}
                </ListItemIcon>

                <ListItemText
                  primary={item.label}
                  sx={[open ? { opacity: 1 } : { opacity: 0 }]}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Divider />

        <List sx={{ mt: "auto" }}>
          <ListItem disablePadding sx={{ display: "block" }}>
            <ListItemButton
              onClick={handleLogout}
              sx={[
                { minHeight: 48, px: 2.5 },
                open ? { justifyContent: "initial" } : { justifyContent: "center" },
              ]}
            >
              <ListItemIcon
                sx={[
                  { minWidth: 0, justifyContent: "center" },
                  open ? { mr: 3 } : { mr: "auto" },
                ]}
              >
                <LogOutIcon size={18} />
              </ListItemIcon>
              <ListItemText primary="Logout" sx={[open ? { opacity: 1 } : { opacity: 0 }]} />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        <Outlet />
      </Box>
    </Box>
  );
}
