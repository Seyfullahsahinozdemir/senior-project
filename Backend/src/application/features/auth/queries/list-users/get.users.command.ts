import { Dependencies } from '@infrastructure/di';
import { validate } from './get.users.command.validator';
import { Response } from 'express';
import CustomResponse from '@application/interfaces/custom.response';

export type GetUsersCommandRequest = Readonly<{
  pageIndex: any;
  pageSize: any;
}>;

export function makeGetUsersCommand({ authService }: Pick<Dependencies, 'authService' | 'userRepository'>) {
  return async function getUsersCommand(command: GetUsersCommandRequest, res: Response) {
    await validate(command);
    const result = await authService.listUsers(command);
    return new CustomResponse({ users: result }, 'success').success(res);
  };
}
