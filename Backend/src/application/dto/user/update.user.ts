import { Preferences } from './preferences.user';

export type UpdateUserDTO = {
  _id: string;
  firstName?: string;
  lastName?: string;
  preferences: Preferences;
};
