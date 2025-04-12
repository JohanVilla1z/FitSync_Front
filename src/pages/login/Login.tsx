import axios from 'axios';
import { Lock, Mail } from 'lucide-react'; // Importar íconos de Lucide
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axiosInstance from '../../api/axiosInstance';
import fitsyncLogo from '../../assets/logos/fitsync-logo.png';
import { Button, Card, CardContent, Input } from '../../components/ui';
import { useAuthStore } from '../../store/authStore';

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
      const response = await axiosInstance.post('/auth/login', data);

      if (response.data && response.data.token) {
        login(response.data.token);
        toast.success('Inicio de sesión exitoso 🚀');
        navigate('/dashboard');
      } else {
        console.error('No se recibió un token válido del servidor');
        toast.error(
          'Error de autenticación: Respuesta incompleta del servidor'
        );
      }
    } catch (error) {
      console.error('Error durante el inicio de sesión:', error);

      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          toast.error('Credenciales incorrectas ❌');
        } else {
          toast.error('Error al iniciar sesión. Inténtelo más tarde.');
        }
      } else {
        toast.error('Ocurrió un error inesperado');
      }
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-gray-900">
      <Card className="w-96 p-6">
        <CardContent>
          <div className="flex flex-col items-center mb-6">
            <img src={fitsyncLogo} alt="FitSync Logo" className="h-16 mb-4" />
            <h2 className="text-2xl font-bold text-center">Iniciar Sesión</h2>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="email"
                placeholder="Correo electrónico"
                className="pl-10"
                {...register('email', { required: 'El correo es obligatorio' })}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="password"
                placeholder="Contraseña"
                className="pl-10"
                {...register('password', {
                  required: 'La contraseña es obligatoria',
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
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              ¿No tienes una cuenta?{' '}
              <Link
                to="/register"
                className="text-primary dark:text-primary-dark font-semibold"
              >
                Regístrate aquí
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
