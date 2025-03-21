import { Power } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import axiosInstance from "../../api/axiosInstance";
import { User } from "../../constants";
import ConfirmationModal from "./ConfirmationModal";

interface UserTableProps {
  isLoading: boolean;
  users: User[];
}

const UserTable = ({ isLoading, users }: UserTableProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleDeactivate = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const confirmDeactivate = async () => {
    if (selectedUser) {
      try {
        // Realizar la solicitud al endpoint para cambiar el estado de actividad
        const response = await axiosInstance.put<User>(
          `/user/${selectedUser.id}/toggle-activity`
        );

        // Mostrar notificación de éxito
        toast.success(
          `El usuario ${response.data.name} ${
            response.data.lastName
          } ahora está ${response.data.isActive ? "activo" : "inactivo"}.`
        );

        // Actualizar el estado de los usuarios si es necesario
        setSelectedUser(null);
      } catch (error) {
        console.error("Error al cambiar el estado del usuario:", error);
        toast.error("Error al cambiar el estado del usuario.");
      } finally {
        // Cerrar el modal
        setIsModalOpen(false);
      }
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700">
        <thead>
          <tr className="bg-gray-100 dark:bg-gray-700 text-left">
            <th className="px-4 py-2 border-b dark:border-gray-600">ID</th>
            <th className="px-4 py-2 border-b dark:border-gray-600">Nombre</th>
            <th className="px-4 py-2 border-b dark:border-gray-600">Email</th>
            <th className="px-4 py-2 border-b dark:border-gray-600">
              Teléfono
            </th>
            <th className="px-4 py-2 border-b dark:border-gray-600">Peso</th>
            <th className="px-4 py-2 border-b dark:border-gray-600">Altura</th>
            <th className="px-4 py-2 border-b dark:border-gray-600">Activo</th>
            <th className="px-4 py-2 border-b dark:border-gray-600">
              Fecha Registro
            </th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={8} className="text-center py-4">
                Cargando...
              </td>
            </tr>
          ) : users.length === 0 ? (
            <tr>
              <td colSpan={8} className="text-center py-4">
                No hay usuarios disponibles.
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr
                key={user.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <td className="px-4 py-2 border-b dark:border-gray-600">
                  {user.id}
                </td>
                <td className="px-4 py-2 border-b dark:border-gray-600">
                  {user.name} {user.lastName}
                </td>
                <td className="px-4 py-2 border-b dark:border-gray-600">
                  {user.email}
                </td>
                <td className="px-4 py-2 border-b dark:border-gray-600">
                  {user.phone || "N/A"}
                </td>
                <td className="px-4 py-2 border-b dark:border-gray-600">
                  {user.weight} kg
                </td>
                <td className="px-4 py-2 border-b dark:border-gray-600">
                  {user.height} m
                </td>
                <td className="px-4 py-2 border-b dark:border-gray-600">
                  <div className="flex items-center gap-2 justify-between">
                    <span>{user.isActive ? "Activo" : "Inactivo"}</span>
                    <button
                      onClick={() => handleDeactivate(user)}
                      className={`h-5 w-5 rounded-full flex align-middle items-center justify-center ${
                        user.isActive ? "bg-green-500" : "bg-red-500"
                      }`}
                    >
                      <span className="align-middle">
                        <Power />
                      </span>
                    </button>
                  </div>
                </td>
                <td className="px-4 py-2 border-b dark:border-gray-600">
                  {new Date(user.registerDate).toLocaleDateString()}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      {/* Modal de Confirmación */}
      <ConfirmationModal
        isOpen={isModalOpen}
        title={`Confirmar ${
          selectedUser?.isActive ? "Desactivación" : "Activación"
        }`}
        message={`¿Estás seguro de que deseas ${
          selectedUser?.isActive ? "desactivar" : "activar"
        } al usuario ${selectedUser?.name} ${selectedUser?.lastName}?`}
        confirmText={`${selectedUser?.isActive ? "Desactivar" : "Activar"}`}
        cancelText="Cancelar"
        onConfirm={confirmDeactivate}
        onCancel={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default UserTable;