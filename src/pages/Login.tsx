import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../api/axiosInstance";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { useAuthStore } from "../store/authStore";

interface LoginForm {
  email: string;
  password: string;
}

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const onSubmit = async (data: LoginForm) => {
    try {
      const response = await axiosInstance.post("/auth/login", data);

      if (response.data && response.data.token) {
        login(response.data.token);
        toast.success("Inicio de sesión exitoso 🚀");
        navigate("/dashboard");
      } else {
        console.error("No se recibió un token válido del servidor");
        toast.error(
          "Error de autenticación: Respuesta incompleta del servidor"
        );
      }
    } catch (error) {
      console.error("Error durante el inicio de sesión:", error);

      if (axios.isAxiosError(error)) {
        // Error específico de Axios
        if (error.response) {
          // El servidor respondió con un estado diferente a 2xx
          console.error("Respuesta del servidor:", error.response.data);
          console.error("Estado HTTP:", error.response.status);

          if (error.response.status === 401) {
            toast.error("Credenciales incorrectas ❌");
          } else if (error.response.status === 429) {
            toast.error("Demasiados intentos. Inténtelo más tarde.");
          } else {
            toast.error(
              `Error del servidor: ${
                error.response.data.message || "Error desconocido"
              }`
            );
          }
        } else if (error.request) {
          // La solicitud fue realizada pero no se recibió respuesta
          console.error("No se recibió respuesta del servidor");
          toast.error(
            "No se pudo conectar con el servidor. Verifique su conexión."
          );
        } else {
          // Error al configurar la solicitud
          console.error("Error de configuración:", error.message);
          toast.error(`Error de configuración: ${error.message}`);
        }
      } else {
        // Error no relacionado con Axios
        console.error("Error no esperado:", error);
        toast.error("Ocurrió un error inesperado");
      }
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <Card className="w-96 p-6">
        <CardContent>
          <h2 className="text-2xl font-bold text-center mb-4">
            Iniciar Sesión
          </h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Input
                type="email"
                placeholder="Correo electrónico"
                {...register("email", { required: "El correo es obligatorio" })}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>
            <div>
              <Input
                type="password"
                placeholder="Contraseña"
                {...register("password", {
                  required: "La contraseña es obligatoria",
                })}
              />
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>
            <Button type="submit" className="w-full">
              Ingresar
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
