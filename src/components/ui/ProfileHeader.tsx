import { User } from '../../constants';
import AuthUser from '../../constants/auth/authUser';
import { getAvatarByRole, getGreeting } from '../../utils';

interface ProfileHeaderProps {
  user: AuthUser | null;
  profile: User;
}

const ProfileHeader = ({ user, profile }: ProfileHeaderProps) => (
  <header className="flex flex-col items-center mb-6">
    <img
      src={getAvatarByRole(user?.role)}
      alt={
        user?.role
          ? `Avatar del usuario con rol ${user?.role}`
          : 'Avatar del usuario'
      }
      className="w-56 h-56 rounded-full mb-4 bg-gray-200 dark:bg-white"
    />
    <h1
      id="profile-header"
      className="text-3xl font-bold text-foreground dark:text-foreground-dark"
    >
      {getGreeting()}, {profile.name}!
    </h1>
    <p className="text-muted dark:text-muted-dark">{profile.email}</p>
  </header>
);

export default ProfileHeader;
