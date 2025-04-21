import { BriefcaseBusiness, UserCog, Users } from 'lucide-react';
import { Role } from '../../../constants';

interface ProfileRoleIconProps {
  userRole: string;
}

const ProfileRoleIcon = ({ userRole }: ProfileRoleIconProps) => {
  // Determinar valores según el rol
  const isAdmin = userRole === Role.ADMIN;
  const isTrainer = userRole === Role.TRAINER;
  const isRegularUser = userRole === Role.USER;

  return (
    <div className="flex justify-center mb-8">
      <div className="flex flex-col items-center">
        <div className="w-24 h-24 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mb-2">
          {isAdmin && (
            <BriefcaseBusiness
              size={48}
              className="text-blue-600 dark:text-blue-400"
            />
          )}
          {isTrainer && (
            <UserCog size={48} className="text-blue-600 dark:text-blue-400" />
          )}
          {isRegularUser && (
            <Users size={48} className="text-blue-600 dark:text-blue-400" />
          )}
        </div>
        <span className="text-lg font-medium">
          {isAdmin && 'Administrador'}
          {isTrainer && 'Entrenador'}
          {isRegularUser && 'Usuario'}
        </span>
      </div>
    </div>
  );
};

export default ProfileRoleIcon;
