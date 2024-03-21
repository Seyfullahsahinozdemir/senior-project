import { Dependencies } from '@infrastructure/di';
import { validate } from './get.following.command.validator';
import { Response } from 'express';
import CustomResponse from '@application/interfaces/custom.response';

export type GetFollowingCommandRequest = Readonly<{
  pageIndex: any;
  pageSize: any;
}>;

export function makeGetFollowingCommand({ userService }: Pick<Dependencies, 'userService'>) {
  return async function getFollowingCommand(command: GetFollowingCommandRequest, res: Response) {
    await validate(command);
    const result = await userService.getFollowing();
    return new CustomResponse({ users: result }, 'success').success(res);
  };
}
