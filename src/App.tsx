import "./App.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./router/Router";
import { FlashMessageProvider } from "./context/FlashMessageProvider";
import { AuthProvider } from "./context/AuthProvider";
import { FlashMessageRoot } from "./components/flashMessage/FlashMessageRoot";

function App() {
  return (
    <AuthProvider>
      <FlashMessageProvider>
        <FlashMessageRoot/>
        <RouterProvider router={router} />
      </FlashMessageProvider>
    </AuthProvider>
  );
}

export default App;
