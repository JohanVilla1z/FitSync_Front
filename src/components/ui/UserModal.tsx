import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { User } from "../../constants/User";
import { useUsersStore } from "../../store";
import { X } from "lucide-react";

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: User; // Si se pasa un usuario, es para editar; si no, es para crear
}

const UserModal = ({ isOpen, onClose, user }: UserModalProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { updateUserInStore } = useUsersStore();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<User>({
    defaultValues: user || {
      name: "",
      lastName: "",
      email: "",
      phone: null,
      weight: 0,
      height: 0,
      isActive: true,
      registerDate: new Date().toISOString(),
      currentIMC: null,
      trainerName: null,
    },
  });

  const onSubmit = async (data: User) => {
    setIsSubmitting(true);
    try {
      if (user) {
        // Editar usuario existente
        const updatedUser = { ...user, ...data };
        await updateUserInStore(updatedUser);
        toast.success(`Usuario ${updatedUser.name} actualizado exitosamente`);
      }
      reset();
      onClose();
    } catch (error) {
      console.error("Error al guardar el usuario:", error);
      toast.error("Error al guardar el usuario. Intenta nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {user ? "Editar Usuario" : "Crear Usuario"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Campos del formulario */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Nombre
            </label>
            <input
              {...register("name", { required: "El nombre es obligatorio" })}
              id="name"
              type="text"
              className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
              placeholder="Nombre del usuario"
            />
            {errors.name && (
              <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
            )}
          </div>
          <div>
            <label htmlFor="last name" className="block text-sm font-medium mb-1">
              Apellido
            </label>
            <input
              {...register("lastName", { required: "El apellido es obligatorio" })}
              id="lastName"
              type="text"
              className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600"
              placeholder="Apellido del usuario"
            />
            {errors.lastName && (
              <p className="text-sm text-red-600 mt-1">{errors.lastName.message}</p>
            )}
          </div>

          {/* Otros campos como lastName, email, phone, etc. */}
          {/* ... */}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-70"
            >
              {isSubmitting ? "Guardando..." : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;