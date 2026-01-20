import { BrowserRouter, Routes, Route } from "react-router-dom";
import { authRoutes } from "./modules/authRoutes";
import { appRoutes } from "./modules/appRoutes";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {authRoutes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
        {appRoutes.map((route) => (
          <Route key={route.path} path={route.path} element={route.element} />
        ))}
      </Routes>
    </BrowserRouter>
  );
}
