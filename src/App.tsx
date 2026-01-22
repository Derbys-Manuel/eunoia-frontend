import "./App.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./router/Router";
import { FlashMessageProvider } from "./context/FlashMessageProvider";
import { AuthProvider } from "./context/AuthProvider";

function App() {
  return (
    <AuthProvider>
      <FlashMessageProvider>
        <RouterProvider router={router} />
      </FlashMessageProvider>
    </AuthProvider>
  );
}

export default App;
