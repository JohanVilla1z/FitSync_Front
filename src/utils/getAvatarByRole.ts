import { Role } from '../constants';
import adminAvatar from '../assets/avatars/ADMIN-avatar.png';
import trainerAvatar from '../assets/avatars/TRAINER-avatar.png';
import userAvatar from '../assets/avatars/USER-avatar.png';

export const getAvatarByRole = (role: Role | string | null | undefined) => {
  switch (role) {
    case Role.ADMIN:
      return adminAvatar;
    case Role.TRAINER:
      return trainerAvatar;
    default:
      return userAvatar;
  }
};
