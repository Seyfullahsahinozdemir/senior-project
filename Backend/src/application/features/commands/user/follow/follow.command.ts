import { Dependencies } from '@infrastructure/di';
import { validate } from './follow.command.validator';
import { Response } from 'express';
import CustomResponse from '@application/interfaces/custom.response';

export type FollowCommandRequest = Readonly<{
  targetUserId: string;
}>;

export function makeFollowCommand({ userService, authService }: Pick<Dependencies, 'userService' | 'authService'>) {
  return async function followCommand(command: FollowCommandRequest, res: Response) {
    await validate(command);
    await userService.follow(authService.currentUserId as string, command.targetUserId);
    return new CustomResponse(null, 'Follow success').success(res);
  };
}
