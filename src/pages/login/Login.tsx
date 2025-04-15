import axios from 'axios';
import { Lock, Mail } from 'lucide-react';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axiosInstance from '../../api/axiosInstance';
import fitsyncLogo from '../../assets/logos/fitsync-logo.png';
import { Button, Card, CardContent, Input } from '../../components/ui';
import { LoginForm, LoginResponse } from '../../constants';
import { useAuthStore } from '../../store/authStore';

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    mode: 'onBlur',
  });

  const loginAction = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const onSubmit: SubmitHandler<LoginForm> = async (data) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.post<LoginResponse>(
        '/auth/login',
        data
      );

      if (response.data?.token) {
        loginAction(response.data.token);
        toast.success('Inicio de sesión exitoso 🚀');
        navigate('/dashboard');
      } else {
        console.error('Respuesta de login inválida:', response.data);
        toast.error(
          'Error de autenticación: Respuesta inesperada del servidor.'
        );
      }
    } catch (error) {
      console.error('Error durante el inicio de sesión:', error);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          toast.error('Correo o contraseña incorrectos ❌');
        } else {
          toast.error(
            `Error ${
              error.response?.status || ''
            }: No se pudo iniciar sesión. Inténtalo de nuevo.`
          );
        }
      } else {
        toast.error('Ocurrió un error inesperado.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 p-4 lg:p-8">
      <Card className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden">
        <CardContent className="p-8 sm:p-10">
          <div className="flex flex-col items-center mb-8">
            <img
              src={fitsyncLogo}
              alt="FitSync Logo"
              className="h-20 w-auto mb-5"
            />
            <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white">
              Bienvenido a FitSync
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-center">
              Ingresa tus credenciales para continuar
            </p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="email-login" className="sr-only">
                Correo electrónico
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
                  aria-hidden="true"
                  size={20}
                />
                <Input
                  id="email-login"
                  type="email"
                  placeholder="tu.correo@ejemplo.com"
                  // Aplicar las mismas clases que en Register.tsx
                  className="pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white w-full"
                  aria-invalid={errors.email ? 'true' : 'false'}
                  aria-describedby="email-error"
                  {...register('email', {
                    required: 'El correo es obligatorio',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Formato de correo inválido',
                    },
                  })}
                />
              </div>
              {errors.email && (
                <p id="email-error" className="text-red-500 text-sm mt-1.5">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="password-login" className="sr-only">
                Contraseña
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
                  aria-hidden="true"
                  size={20}
                />
                <Input
                  id="password-login"
                  type="password"
                  placeholder="Contraseña"
                  // Aplicar las mismas clases que en Register.tsx
                  className="pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white w-full"
                  aria-invalid={errors.password ? 'true' : 'false'}
                  aria-describedby="password-error"
                  {...register('password', {
                    required: 'La contraseña es obligatoria',
                  })}
                />
              </div>
              {errors.password && (
                <p id="password-error" className="text-red-500 text-sm mt-1.5">
                  {errors.password.message}
                </p>
              )}
              <div className="text-right mt-2">
                <Link
                  to="/forgot-password"
                  className="text-sm font-medium text-primary hover:text-primary-dark dark:hover:text-primary-light hover:underline"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 rounded-md transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Ingresando...
                </div>
              ) : (
                'Ingresar'
              )}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              ¿Eres nuevo aquí?{' '}
              <Link
                to="/register"
                className="font-semibold text-primary hover:text-primary-dark dark:hover:text-primary-light hover:underline"
              >
                Crea una cuenta
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
