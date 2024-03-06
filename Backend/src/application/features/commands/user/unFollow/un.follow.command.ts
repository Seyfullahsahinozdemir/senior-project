import { Dependencies } from '@infrastructure/di';
import { validate } from './un.follow.command.validator';
import { Response } from 'express';
import CustomResponse from '@application/interfaces/custom.response';

export type UnFollowCommandRequest = Readonly<{
  currentUserId: string;
  targetUserId: string;
}>;

export function makeUnFollowCommand({ userService }: Pick<Dependencies, 'userService'>) {
  return async function unFollowCommand(command: UnFollowCommandRequest, res: Response) {
    await validate(command);
    await userService.unFollow(command.currentUserId, command.targetUserId);
    return new CustomResponse(null, 'Unfollow success').success(res);
  };
}
