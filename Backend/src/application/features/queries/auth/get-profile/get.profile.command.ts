import { Dependencies } from '@infrastructure/di';
import { Response } from 'express';
import CustomResponse from '@application/interfaces/custom.response';
import { NotFoundException } from '@application/exceptions';

export function makeGetProfileCommand({
  authService,
  userRepository,
}: Pick<Dependencies, 'authService' | 'userRepository'>) {
  return async function getProfileCommand(res: Response) {
    if (!authService.currentUserId) {
      throw new NotFoundException('Current user not found');
    }

    const result = await authService.getMyProfile(authService.currentUserId);

    const followingList = [];
    for (const following of result.following) {
      const user = await userRepository.findOne(following.toString());
      followingList.push({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
      });
    }

    const followerList = [];
    for (const follower of result.followers) {
      const user = await userRepository.findOne(follower.toString());
      followerList.push({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        email: user.email,
      });
    }

    const updatedUser: any = {};
    updatedUser._id = result._id;
    updatedUser.createdAt = result.createdAt;
    updatedUser.firstName = result.firstName;
    updatedUser.lastName = result.lastName;
    updatedUser.username = result.username;
    updatedUser.email = result.email;
    updatedUser.preferences = result.preferences;
    updatedUser.following = followingList;
    updatedUser.followers = followerList;

    return new CustomResponse({ user: updatedUser }, 'success').success(res);
  };
}
