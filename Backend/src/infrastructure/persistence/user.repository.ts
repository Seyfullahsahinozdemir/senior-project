import { User } from '@domain/entities/identity/user';
import { BaseRepository } from './base.repository';
import { IUserRepository } from '@application/persistence/IUserRepository';
import { Dependencies } from '@infrastructure/di';

export class UserRepository extends BaseRepository<User> implements IUserRepository {
  constructor(db: Pick<Dependencies, 'db'>) {
    super(db, 'user');
  }

  async findByUsernameAsync(username: string): Promise<User> {
    const result = await this._collection.findOne({ username: username });

    return result as unknown as User;
  }

  async findByEmailAsync(email: string): Promise<User> {
    const result = await this._collection.findOne({ email: email });
    return result as unknown as User;
  }
}
