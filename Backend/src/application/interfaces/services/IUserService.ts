import { PaginatedRequest } from '@application/dto/common/paginated.request';
import { User } from '@domain/entities';

export interface IUserService {
  getFollowers(_id: string): Promise<User[]>;
  getFollowing(_id: string): Promise<User[]>;
  follow(currentUserId: string, targetUserId: string): Promise<boolean>;
  unFollow(currentUserId: string, targetUserId: string): Promise<boolean>;
  listUsers(info: PaginatedRequest): Promise<User[]>;
}
