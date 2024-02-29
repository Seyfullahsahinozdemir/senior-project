import { User } from '@domain/entities';

export class Token {
  accessToken!: string;
  refreshToken!: string;
  user?: User;
}
