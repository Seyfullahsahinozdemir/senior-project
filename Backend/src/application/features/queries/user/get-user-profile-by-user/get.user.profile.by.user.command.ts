import { Dependencies } from '@infrastructure/di';
import { Response } from 'express';
import CustomResponse from '@application/interfaces/custom.response';
import { validate } from './get.user.profile.by.user.command.validator';

export type GetUserProfileByUser = Readonly<{
  _id: string;
}>;

export function makeGetUserProfileByUserCommand({
  userRepository,
  userService,
  authService,
}: Pick<Dependencies, 'authService' | 'userRepository' | 'userService'>) {
  return async function getProfileCommand(command: GetUserProfileByUser, res: Response) {
    await validate(command);
    const result = await userService.getProfileByUser(command._id);

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
    updatedUser.isFollow = result.followers.some((followerId) => followerId.toString() === authService.currentUserId);

    return new CustomResponse({ user: updatedUser }, 'success').success(res);
  };
}
