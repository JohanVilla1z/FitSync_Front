import { Lock, Mail, Ruler, User, Weight } from 'lucide-react'; // Importar íconos de Lucide
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import fitsyncLogo from '../../assets/logos/fitsync-logo.png';
import { Button, Card, CardContent, Input } from '../../components/ui';
import RegisterForm from '../../constants/auth/registerForm';
import { registerUser } from '../../services/authService';

interface ExtendedRegisterForm extends RegisterForm {
  confirmPassword: string; // Campo adicional para confirmar la contraseña
}

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ExtendedRegisterForm>();
  const navigate = useNavigate();

  // Observar el valor del campo "password" para compararlo con "confirmPassword"
  const password = watch('password');

  const onSubmit = async (data: ExtendedRegisterForm) => {
    try {
      const { confirmPassword, ...registerData } = data; // Excluir confirmPassword antes de enviar
      await registerUser(registerData); // Llamar al servicio de registro
      toast.success('Registro exitoso 🚀');
      navigate('/login');
    } catch (error) {
      console.error('Error durante el registro:', error);
      toast.error('Error al registrar el usuario. Inténtelo más tarde.');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-gray-900">
      <Card className="w-96 p-6">
        <CardContent>
          <div className="flex flex-col items-center mb-6">
            <img src={fitsyncLogo} alt="FitSync Logo" className="h-16 mb-4" />
            <h2 className="text-2xl font-bold text-center">Registro</h2>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Nombre"
                className="pl-10"
                {...register('name', {
                  required: 'El nombre es obligatorio',
                  minLength: { value: 2, message: 'Mínimo 2 caracteres' },
                  maxLength: { value: 50, message: 'Máximo 50 caracteres' },
                })}
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}
            </div>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Apellido"
                className="pl-10"
                {...register('lastName', {
                  required: 'El apellido es obligatorio',
                  minLength: { value: 2, message: 'Mínimo 2 caracteres' },
                  maxLength: { value: 50, message: 'Máximo 50 caracteres' },
                })}
              />
              {errors.lastName && (
                <p className="text-red-500 text-sm">
                  {errors.lastName.message}
                </p>
              )}
            </div>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="email"
                placeholder="Correo electrónico"
                className="pl-10"
                {...register('email', {
                  required: 'El correo es obligatorio',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Formato de correo inválido',
                  },
                })}
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
                  minLength: { value: 6, message: 'Mínimo 6 caracteres' },
                })}
              />
              {errors.password && (
                <p className="text-red-500 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="password"
                placeholder="Confirmar Contraseña"
                className="pl-10"
                {...register('confirmPassword', {
                  required: 'La confirmación de contraseña es obligatoria',
                  validate: (value) =>
                    value === password || 'Las contraseñas no coinciden',
                })}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
            <div className="relative">
              <Ruler className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="number"
                placeholder="Altura (m)"
                step="0.01"
                className="pl-10"
                {...register('userHeight', {
                  required: 'La altura es obligatoria',
                })}
              />
              {errors.userHeight && (
                <p className="text-red-500 text-sm">
                  {errors.userHeight.message}
                </p>
              )}
            </div>
            <div className="relative">
              <Weight className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="number"
                placeholder="Peso (kg)"
                step="0.1"
                className="pl-10"
                {...register('userWeight', {
                  required: 'El peso es obligatorio',
                })}
              />
              {errors.userWeight && (
                <p className="text-red-500 text-sm">
                  {errors.userWeight.message}
                </p>
              )}
            </div>
            <Button type="submit" className="w-full">
              Registrarse
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
