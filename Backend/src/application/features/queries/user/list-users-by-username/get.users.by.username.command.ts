import { Dependencies } from '@infrastructure/di';
import { validate } from './get.users.by.username.command.validator';
import { Response } from 'express';
import CustomResponse from '@application/interfaces/custom.response';

export type GetUsersByUsernameCommandRequest = Readonly<{
  pageIndex: any;
  pageSize: any;
  key: string;
}>;

export function makeGetUsersByUsernameCommand({ userService }: Pick<Dependencies, 'userService'>) {
  return async function getUsersByUsernameCommand(command: GetUsersByUsernameCommandRequest, res: Response) {
    await validate(command);
    const result = await userService.listUsersByUsername(command);
    return new CustomResponse({ users: result }, 'success').success(res);
  };
}
