import { Dependencies } from '@infrastructure/di';
import { validate } from './un.follow.command.validator';
import { Response } from 'express';
import CustomResponse from '@application/interfaces/custom.response';

export type UnFollowCommandRequest = Readonly<{
  targetUserId: string;
}>;

export function makeUnFollowCommand({ userService, authService }: Pick<Dependencies, 'userService' | 'authService'>) {
  return async function unFollowCommand(command: UnFollowCommandRequest, res: Response) {
    await validate(command);
    await userService.unFollow(authService.currentUserId as string, command.targetUserId);
    return new CustomResponse(null, 'Unfollow success').success(res);
  };
}
