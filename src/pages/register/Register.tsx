import axios from 'axios';
import { Lock, Mail, Phone, Ruler, User, Weight } from 'lucide-react';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import fitsyncLogo from '../../assets/logos/fitsync-logo.png';
import { Button, Card, CardContent, Input } from '../../components/ui';
import RegisterForm from '../../constants/auth/registerForm';
import { registerUser } from '../../services/authService';
interface ExtendedRegisterForm extends RegisterForm {
  confirmPassword: string;
}

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ExtendedRegisterForm>({
    mode: 'onBlur',
  });
  const navigate = useNavigate();

  const password = watch('password');

  const onSubmit: SubmitHandler<ExtendedRegisterForm> = async (data) => {
    setIsLoading(true);
    const { confirmPassword, ...registerData } = data;

    const payload = {
      ...registerData,
      userHeight: parseFloat(registerData.userHeight as any),
      userWeight: parseFloat(registerData.userWeight as any),
      phone: registerData.phone ? registerData.phone : undefined,
    };

    try {
      await registerUser(payload);
      toast.success('Registro exitoso 🚀 ¡Ahora puedes iniciar sesión!');
      navigate('/login');
    } catch (error) {
      console.error('Error durante el registro:', error);
      let errorMessage = 'Error al registrar el usuario. Inténtelo más tarde.';
      if (axios.isAxiosError(error) && error.response) {
        errorMessage =
          error.response.data?.message ||
          `Error ${error.response.status}: ${error.response.statusText}`;
        if (error.response.status === 409) {
          errorMessage = 'El correo electrónico ya está registrado.';
        }
      }
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 p-4 lg:p-8">
      <Card className="w-full max-w-lg bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden">
        <CardContent className="p-8 sm:p-10">
          <div className="flex flex-col items-center mb-8">
            <img
              src={fitsyncLogo}
              alt="FitSync Logo"
              className="h-20 w-auto mb-5"
            />
            <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white">
              Crea tu Cuenta
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-2 text-center">
              Completa el formulario para unirte a FitSync
            </p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name-register" className="sr-only">
                  Nombre
                </label>
                <div className="relative">
                  <User
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
                    size={20}
                    aria-hidden="true"
                  />
                  <Input
                    id="name-register"
                    type="text"
                    placeholder="Nombre"
                    className="pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white w-full"
                    aria-invalid={errors.name ? 'true' : 'false'}
                    aria-describedby="name-error"
                    {...register('name', {
                      required: 'El nombre es obligatorio',
                      minLength: { value: 2, message: 'Mínimo 2 caracteres' },
                      maxLength: { value: 50, message: 'Máximo 50 caracteres' },
                    })}
                  />
                </div>
                {errors.name && (
                  <p id="name-error" className="text-red-500 text-sm mt-1.5">
                    {errors.name.message}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="lastName-register" className="sr-only">
                  Apellido
                </label>
                <div className="relative">
                  <User
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
                    size={20}
                    aria-hidden="true"
                  />
                  <Input
                    id="lastName-register"
                    type="text"
                    placeholder="Apellido"
                    className="pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white w-full"
                    aria-invalid={errors.lastName ? 'true' : 'false'}
                    aria-describedby="lastName-error"
                    {...register('lastName', {
                      required: 'El apellido es obligatorio',
                      minLength: { value: 2, message: 'Mínimo 2 caracteres' },
                      maxLength: { value: 50, message: 'Máximo 50 caracteres' },
                    })}
                  />
                </div>
                {errors.lastName && (
                  <p
                    id="lastName-error"
                    className="text-red-500 text-sm mt-1.5"
                  >
                    {errors.lastName.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="email-register" className="sr-only">
                Correo electrónico
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
                  size={20}
                  aria-hidden="true"
                />
                <Input
                  id="email-register"
                  type="email"
                  placeholder="tu.correo@ejemplo.com"
                  className="pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white w-full"
                  aria-invalid={errors.email ? 'true' : 'false'}
                  aria-describedby="email-error-register"
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
                <p
                  id="email-error-register"
                  className="text-red-500 text-sm mt-1.5"
                >
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="phone-register" className="sr-only">
                Teléfono (Opcional)
              </label>
              <div className="relative">
                <Phone
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
                  size={20}
                  aria-hidden="true"
                />
                <Input
                  id="phone-register"
                  type="tel"
                  placeholder="Teléfono (Opcional)"
                  className="pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white w-full"
                  aria-invalid={errors.phone ? 'true' : 'false'}
                  aria-describedby="phone-error"
                  {...register('phone')}
                />
              </div>
              {errors.phone && (
                <p id="phone-error" className="text-red-500 text-sm mt-1.5">
                  {errors.phone.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="password-register" className="sr-only">
                Contraseña
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
                  size={20}
                  aria-hidden="true"
                />
                <Input
                  id="password-register"
                  type="password"
                  placeholder="Contraseña"
                  className="pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white w-full"
                  aria-invalid={errors.password ? 'true' : 'false'}
                  aria-describedby="password-error-register"
                  {...register('password', {
                    required: 'La contraseña es obligatoria',
                    minLength: { value: 6, message: 'Mínimo 6 caracteres' },
                  })}
                />
              </div>
              {errors.password && (
                <p
                  id="password-error-register"
                  className="text-red-500 text-sm mt-1.5"
                >
                  {errors.password.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword-register" className="sr-only">
                Confirmar Contraseña
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
                  size={20}
                  aria-hidden="true"
                />
                <Input
                  id="confirmPassword-register"
                  type="password"
                  placeholder="Confirmar Contraseña"
                  className="pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white w-full"
                  aria-invalid={errors.confirmPassword ? 'true' : 'false'}
                  aria-describedby="confirmPassword-error"
                  {...register('confirmPassword', {
                    required: 'La confirmación es obligatoria',
                    validate: (value) =>
                      value === password || 'Las contraseñas no coinciden',
                  })}
                />
              </div>
              {errors.confirmPassword && (
                <p
                  id="confirmPassword-error"
                  className="text-red-500 text-sm mt-1.5"
                >
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="height-register" className="sr-only">
                  Altura (m)
                </label>
                <div className="relative">
                  <Ruler
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
                    size={20}
                    aria-hidden="true"
                  />
                  <Input
                    id="height-register"
                    type="number"
                    placeholder="Altura (m)"
                    step="0.01"
                    min="0"
                    className="pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white w-full"
                    aria-invalid={errors.userHeight ? 'true' : 'false'}
                    aria-describedby="height-error"
                    {...register('userHeight', {
                      required: 'La altura es obligatoria',
                      valueAsNumber: true,
                      min: { value: 0.5, message: 'Altura inválida' },
                      max: { value: 3.0, message: 'Altura inválida' },
                    })}
                  />
                </div>
                {errors.userHeight && (
                  <p id="height-error" className="text-red-500 text-sm mt-1.5">
                    {errors.userHeight.message}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="weight-register" className="sr-only">
                  Peso (kg)
                </label>
                <div className="relative">
                  <Weight
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
                    size={20}
                    aria-hidden="true"
                  />
                  <Input
                    id="weight-register"
                    type="number"
                    placeholder="Peso (kg)"
                    step="0.1"
                    min="0"
                    className="pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent dark:bg-gray-700 dark:text-white w-full"
                    aria-invalid={errors.userWeight ? 'true' : 'false'}
                    aria-describedby="weight-error"
                    {...register('userWeight', {
                      required: 'El peso es obligatorio',
                      valueAsNumber: true,
                      min: { value: 20, message: 'Peso inválido' },
                      max: { value: 500, message: 'Peso inválido' },
                    })}
                  />
                </div>
                {errors.userWeight && (
                  <p id="weight-error" className="text-red-500 text-sm mt-1.5">
                    {errors.userWeight.message}
                  </p>
                )}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary-dark text-white font-semibold py-3 rounded-md transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed mt-4"
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
                  Registrando...
                </div>
              ) : (
                'Registrarse'
              )}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              ¿Ya tienes una cuenta?{' '}
              <Link
                to="/login"
                className="font-semibold text-primary hover:text-primary-dark dark:hover:text-primary-light hover:underline"
              >
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
