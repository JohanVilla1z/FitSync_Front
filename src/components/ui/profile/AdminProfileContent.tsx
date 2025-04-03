import { UserProfile } from '../../../store/useUserProfileStore';
import AdminDashboardCards from './AdminDashboardCards';

interface AdminProfileContentProps {
  profile: UserProfile;
  userRole: string;
}

const AdminProfileContent = ({ profile }: AdminProfileContentProps) => {
  // Función para renderizar información básica del administrador
  const renderAdminInfo = () => (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-semibold">Información Personal</h2>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Nombre
              </h3>
              <p className="mt-1 text-sm">{profile.name}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Email
              </h3>
              <p className="mt-1 text-sm">{profile.email}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Rol
              </h3>
              <p className="mt-1 text-sm">Administrador</p>
            </div>
            {profile.isActive !== undefined && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Estado
                </h3>
                <p className="mt-1 text-sm flex items-center">
                  <span
                    className={`inline-block w-2 h-2 rounded-full mr-2 ${
                      profile.isActive ? 'bg-green-500' : 'bg-red-500'
                    }`}
                  ></span>
                  {profile.isActive ? 'Activo' : 'Inactivo'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Usamos nuestro componente personalizado en lugar de BasicInfo */}
      {renderAdminInfo()}

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <h2 className="text-xl font-semibold mb-4">Panel de Administrador</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Tienes acceso completo a la administración del sistema. Usa la barra
          lateral para navegar entre las diferentes funciones administrativas.
        </p>

        <AdminDashboardCards />

        {/* Estadísticas generales */}
        <div className="mt-6">
          <h3 className="font-semibold text-lg mb-2">
            Estadísticas del Sistema
          </h3>
          <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              Como administrador, puedes acceder a estadísticas detalladas desde
              el panel de control y generar informes sobre el uso del gimnasio.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfileContent;
