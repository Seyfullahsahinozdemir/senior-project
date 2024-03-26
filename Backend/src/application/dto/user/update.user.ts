import { Preferences } from './preferences.user';

export type UpdateUserDTO = {
  firstName?: string;
  lastName?: string;
  preferences: Preferences;
};
