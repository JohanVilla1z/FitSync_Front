import { Edit } from 'lucide-react';
import { UserProfile } from '../../../store/useUserProfileStore';
import { getGreeting, getActiveSinceMessage } from '../../../utils';

interface ProfileHeaderProps {
  profile: UserProfile;
  onEditClick: () => void;
}

const ProfileHeader = ({ profile, onEditClick }: ProfileHeaderProps) => (
  <div className="flex justify-between items-start mb-6">
    <div className="flex-grow">
      <h1 className="text-2xl font-bold mb-1">
        {getGreeting()}, {profile.name}!
      </h1>
      <p className="text-gray-600 dark:text-gray-400">{profile.email}</p>
      {profile.registerDate && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {getActiveSinceMessage(profile.registerDate)}
        </p>
      )}
    </div>

    {/* Botón para gestionar perfil */}
    <div className="flex">
      <button
        onClick={onEditClick}
        className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        aria-label="Gestionar perfil"
      >
        <Edit size={16} />
        <span>Gestionar Perfil</span>
      </button>
    </div>
  </div>
);

export default ProfileHeader;
