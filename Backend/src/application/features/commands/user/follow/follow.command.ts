import { Dependencies } from '@infrastructure/di';
import { validate } from './follow.command.validator';
import { Response } from 'express';
import CustomResponse from '@application/interfaces/custom.response';

export type FollowCommandRequest = Readonly<{
  currentUserId: string;
  targetUserId: string;
}>;

export function makeFollowCommand({ userService }: Pick<Dependencies, 'userService'>) {
  return async function followCommand(command: FollowCommandRequest, res: Response) {
    await validate(command);
    await userService.follow(command.currentUserId, command.targetUserId);
    return new CustomResponse(null, 'success').success(res);
  };
}
