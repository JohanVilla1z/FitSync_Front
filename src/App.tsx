import { useEffect } from "react";
import { useThemeStore } from "./store";
import { ToastContainer } from "react-toastify";
import AppRoutes from "./routes";

function App() {
  const { theme } = useThemeStore();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <>
      <AppRoutes />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={theme} // Usar el tema del estado
      />
    </>
  );
}

export default App;
