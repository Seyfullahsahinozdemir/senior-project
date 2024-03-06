import { PaginatedRequest } from '@application/dto/common/paginated.request';
import { IUserService } from '@application/interfaces';
import { IUserRepository } from '@application/persistence';
import { User } from '@domain/entities/identity/user';
import { Dependencies } from '@infrastructure/di';
import { ObjectId } from 'mongodb';

export class UserService implements IUserService {
  public readonly userRepository: IUserRepository;

  constructor({ userRepository }: Dependencies) {
    this.userRepository = userRepository;
  }

  async listUsers(info: PaginatedRequest): Promise<User[]> {
    const index: number = parseInt(info.pageIndex as string);
    const size: number = parseInt(info.pageSize as string);

    const users: User[] = await this.userRepository.find({}, index, size);
    return users;
  }

  async getFollowers(_id: string): Promise<User[]> {
    const user: User = await this.userRepository.findOne(_id);

    if (!user) {
      throw new Error('User not found');
    }

    const followerIds = user.followers || [];

    const followers = await this.userRepository.find({ _id: { $in: followerIds } });

    return followers;
  }

  async getFollowing(_id: string): Promise<User[]> {
    const user: User = await this.userRepository.findOne(_id);

    if (!user) {
      throw new Error('User not found');
    }

    const followingIds = user.following || [];

    // Retrieve following users using the userRepository
    const following = await this.userRepository.find({ _id: { $in: followingIds } }, 0, 0);

    return following;
  }

  async follow(currentUserId: string, targetUserId: string): Promise<boolean> {
    if (currentUserId == targetUserId) {
      throw new Error('Users ids same.');
    }

    // Get the current user and the target user
    const currentUser: User = await this.userRepository.findOne(currentUserId);
    const targetUser: User = await this.userRepository.findOne(targetUserId);

    if (!currentUser || !targetUser) {
      throw new Error('User not found');
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
    // Get the current user and the target user
    const currentUser: User = await this.userRepository.findOne(currentUserId);
    const targetUser: User = await this.userRepository.findOne(targetUserId);

    if (!currentUser || !targetUser) {
      throw new Error('User not found');
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
