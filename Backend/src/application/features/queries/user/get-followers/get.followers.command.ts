import { Dependencies } from '@infrastructure/di';
import { validate } from './get.followers.command.validator';
import { Response } from 'express';
import CustomResponse from '@application/interfaces/custom.response';

export type GetFollowersCommandRequest = Readonly<{
  pageIndex: any;
  pageSize: any;
  _id: string;
}>;

export function makeGetFollowersCommand({ userService }: Pick<Dependencies, 'userService'>) {
  return async function getFollowersCommand(command: GetFollowersCommandRequest, res: Response) {
    await validate(command);
    const result = await userService.getFollowers();
    return new CustomResponse({ users: result }, 'success').success(res);
  };
}
