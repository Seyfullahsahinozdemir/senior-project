import { PaginatedRequest } from '@application/dto/common/paginated.request';
import { GetFavoriteItemDTO } from '@application/dto/user/get.favorite.item';
import { UpdateUserDTO } from '@application/dto/user/update.user';
import { NotFoundException, ValidationException } from '@application/exceptions';
import { IAuthService, IImageService, IUserService } from '@application/interfaces';
import { IItemRepository, IUserRepository } from '@application/persistence';
import { Item } from '@domain/entities';
import { User } from '@domain/entities/identity/user';
import { ObjectId } from 'mongodb';
import { isValidObjectId } from 'mongoose';

export class UserService implements IUserService {
  public readonly userRepository: IUserRepository;
  public readonly authService: IAuthService;
  public readonly imageService: IImageService;
  public readonly itemRepository: IItemRepository;

  constructor({
    userRepository,
    authService,
    imageService,
    itemRepository,
  }: {
    userRepository: IUserRepository;
    authService: IAuthService;
    imageService: IImageService;
    itemRepository: IItemRepository;
  }) {
    this.userRepository = userRepository;
    this.authService = authService;
    this.imageService = imageService;
    this.itemRepository = itemRepository;
  }

  async getFavoriteItemsByCurrentUser(info: PaginatedRequest): Promise<Item[]> {
    const user = await this.userRepository.findOne(this.authService.currentUserId as string);
    if (!user) {
      throw new NotFoundException('User not found.');
    }

    const pageIndex = info.pageIndex ? parseInt(info.pageIndex) : 0;
    const pageSize = info.pageSize ? parseInt(info.pageSize) : 5;

    const result: Item[] = [];
    const startIndex = pageIndex * pageSize;
    const endIndex = startIndex + pageSize;

    for (let i = startIndex; i < endIndex && i < user.favoriteItems.length; i++) {
      result.push(await this.itemRepository.findOne(user.favoriteItems[i].toString()));
    }

    return result;
  }

  async getFavoriteItemsByUserId(info: GetFavoriteItemDTO): Promise<Item[]> {
    const user = await this.userRepository.findOne(info.userId);
    if (!user) {
      throw new NotFoundException('User not found.');
    }

    const pageIndex = info.pageIndex ? parseInt(info.pageIndex) : 0;
    const pageSize = info.pageSize ? parseInt(info.pageSize) : 5;

    const result: Item[] = [];
    const startIndex = pageIndex * pageSize;
    const endIndex = startIndex + pageSize;

    for (let i = startIndex; i < endIndex && i < user.favoriteItems.length; i++) {
      result.push(await this.itemRepository.findOne(user.favoriteItems[i].toString()));
    }

    return result;
  }

  async addFavoriteItem(itemId: string): Promise<void> {
    const item = await this.itemRepository.findOne(itemId);
    if (!item) {
      throw new NotFoundException('Item not found.');
    }

    const user = await this.userRepository.findOne(this.authService.currentUserId as string);
    if (!user) {
      throw new NotFoundException('User not found.');
    }

    if (user.favoriteItems.map(String).includes(item._id?.toString() ?? '')) {
      throw new ValidationException('You already add this item to favorite list.');
    }

    user.favoriteItems.push(new ObjectId(item._id));
    await this.userRepository.update(user._id?.toString() as string, user);
  }

  async deleteFavoriteItem(itemId: string): Promise<void> {
    const item = await this.itemRepository.findOne(itemId);
    if (!item) {
      throw new NotFoundException('Item not found.');
    }

    const user = await this.userRepository.findOne(this.authService.currentUserId as string);
    if (!user) {
      throw new NotFoundException('User not found.');
    }
    const index = user.favoriteItems.map(String).indexOf(item._id?.toString() ?? '');
    if (index === -1) {
      throw new NotFoundException('Item not found in favorite list.');
    }

    user.favoriteItems.splice(index, 1);
    await this.userRepository.update(user._id?.toString() as string, user);
  }

  async getProfileByUser(_id: string): Promise<User> {
    const user = await this.userRepository.findOne(_id);
    if (!user) {
      throw new NotFoundException('User not found.');
    }

    if (user.deletedAt) {
      throw new NotFoundException('User not found.');
    }

    user.password = '';
    return user;
  }

  async listUsersByUsername(info: PaginatedRequest): Promise<User[]> {
    const index: number = parseInt(info.pageIndex as string);
    const size: number = parseInt(info.pageSize as string);

    const username: string = info.key as string;
    const query = { username: { $regex: new RegExp(username, 'i') } };

    const users: User[] = await this.userRepository.find(query, index, size);

    const reducedUsers = users.map(({ _id, username, firstName, lastName, email, preferences }) => ({
      _id,
      username,
      firstName,
      lastName,
      email,
      preferences,
    }));

    return reducedUsers as User[];
  }

  async updateUser(info: UpdateUserDTO): Promise<User> {
    const user: User = await this.userRepository.findOne(this.authService.currentUserId as string);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.firstName = info.firstName ? info.firstName : user.firstName;
    user.lastName = info.lastName ? info.lastName : user.lastName;

    user.preferences.about ??= info.preferences.about;
    user.preferences.address ??= info.preferences.address;
    user.preferences.gender ??= info.preferences.gender;
    user.preferences.phone ??= info.preferences.phone;

    if (info.preferences.image.filename !== '') {
      user.preferences.image.filename = info.preferences.image.filename;
      user.preferences.image.mimetype = info.preferences.image.mimetype;
    }

    user.updatedAt = new Date();
    user.updatedBy = this.authService.currentUserId as string;

    return await this.userRepository.update(this.authService.currentUserId as string, user);
  }

  async listUsers(info: PaginatedRequest): Promise<User[]> {
    const index: number = parseInt(info.pageIndex as string);
    const size: number = parseInt(info.pageSize as string);

    const users: User[] = await this.userRepository.find({}, index, size);
    return users;
  }

  async getFollowers(): Promise<User[]> {
    const user: User = await this.userRepository.findOne(this.authService.currentUserId as string);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const followerIds = user.followers || [];

    const followers = await this.userRepository.find({ _id: { $in: followerIds } });

    return followers;
  }

  async getFollowing(): Promise<User[]> {
    const user: User = await this.userRepository.findOne(this.authService.currentUserId as string);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const followingIds = user.following || [];

    // Retrieve following users using the userRepository
    const following = await this.userRepository.find({ _id: { $in: followingIds } }, 0, 0);

    const reducedFollowing = following.map(({ _id, username, firstName, lastName, email, preferences }) => ({
      _id,
      username,
      firstName,
      lastName,
      email,
      preferences,
    }));

    return reducedFollowing as User[];
  }

  async follow(currentUserId: string, targetUserId: string): Promise<boolean> {
    if (!isValidObjectId(currentUserId) || !isValidObjectId(targetUserId)) {
      throw new ValidationException('Invalid user ID format');
    }

    if (currentUserId == targetUserId) {
      throw new ValidationException('Users ids same.');
    }

    // Get the current user and the target user
    const currentUser: User = await this.userRepository.findOne(currentUserId);
    const targetUser: User = await this.userRepository.findOne(targetUserId);

    if (!currentUser || !targetUser) {
      throw new NotFoundException('User not found');
    }

    // Add the target user's ID to the current user's following list
    currentUser.following.push(new ObjectId(targetUserId));

    // Add the current user's ID to the target user's followers list
    targetUser.followers.push(new ObjectId(currentUserId));

    // Update both users in the database
    await Promise.all([
      this.userRepository.update(currentUserId, currentUser),
      this.userRepository.update(targetUserId, targetUser),
    ]);

    return true;
  }

  async unFollow(currentUserId: string, targetUserId: string): Promise<boolean> {
    if (!isValidObjectId(currentUserId) || !isValidObjectId(targetUserId)) {
      throw new ValidationException('Invalid user ID format');
    }
    // Get the current user and the target user
    const currentUser: User = await this.userRepository.findOne(currentUserId);
    const targetUser: User = await this.userRepository.findOne(targetUserId);

    if (!currentUser || !targetUser) {
      throw new NotFoundException('User not found');
    }

    // Remove the target user's ID from the current user's following list
    const followingIndex = currentUser.following?.findIndex((id) => id.toString() === targetUserId);

    if (followingIndex !== -1) {
      currentUser.following.splice(followingIndex, 1);
    }

    // Remove the current user's ID from the target user's followers list
    const followersIndex = targetUser.followers?.findIndex((id) => id.toString() === currentUserId);
    if (followersIndex !== -1) {
      targetUser.followers.splice(followersIndex, 1);
    }

    // Update both users in the database
    await Promise.all([
      this.userRepository.update(currentUserId, currentUser),
      this.userRepository.update(targetUserId, targetUser),
    ]);

    return true;
  }
}
