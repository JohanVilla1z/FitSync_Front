import { Role } from '../constants';

export const getAvatarByRole = (role: Role | string | null | undefined) => {
  switch (role) {
    case Role.ADMIN:
      return 'src/assets/avatars/ADMIN-avatar.png';
    case Role.TRAINER:
      return 'src/assets/avatars/Trainer-avatar.png';
    default:
      return 'src/assets/avatars/USER-avatar.png';
  }
};
