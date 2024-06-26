import { PaginatedRequest } from '@application/dto/common/paginated.request';
import { Item, User } from '@domain/entities';
import { UpdateUserDTO } from '@application/dto/user/update.user';
import { GetFavoriteItemDTO } from '@application/dto/user/get.favorite.item';
export interface IUserService {
  getFollowers(): Promise<User[]>;
  getFollowing(): Promise<User[]>;
  follow(currentUserId: string, targetUserId: string): Promise<boolean>;
  unFollow(currentUserId: string, targetUserId: string): Promise<boolean>;
  listUsers(info: PaginatedRequest): Promise<User[]>;
  listUsersByUsername(info: PaginatedRequest): Promise<User[]>;
  updateUser(info: UpdateUserDTO): Promise<User>;
  getProfileByUser(_id: string): Promise<User>;

  getFavoriteItemsByUserId(info: GetFavoriteItemDTO): Promise<Item[]>;
  getFavoriteItemsByCurrentUser(info: PaginatedRequest): Promise<Item[]>;

  addFavoriteItem(itemId: string): Promise<void>;
  deleteFavoriteItem(itemId: string): Promise<void>;
}
