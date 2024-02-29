import { User } from '@domain/entities/identity/user';
import { IRead } from './IRead';
import { IWrite } from './IWrite';

export interface IUserRepository extends IWrite<User>, IRead<User> {
  findByUsernameAsync(username: string): Promise<User>;
  findByEmailAsync(email: string): Promise<User>;
}
